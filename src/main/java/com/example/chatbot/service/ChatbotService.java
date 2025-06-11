package com.example.chatbot.service;

import com.example.chatbot.config.ClovaChatbotConfig;
import com.example.chatbot.entity.ChatBotEntity;
import com.example.chatbot.repository.ChatBotMessageRepository;
import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.UsersEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatbotService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final String API_VERSION = "v2";
    private static final String EVENT_TYPE_OPEN = "open";
    private static final String EVENT_TYPE_SEND = "send";

    private final WebClient clovaWebClient;
    private final ClovaChatbotConfig.ChatbotProps props;
    private final ChatBotMessageRepository messageRepo;
    private final ObjectMapper objectMapper;

    @Transactional
    public Map<String, Object> ask(UsersEntity user, String question, String acaId, LocalDateTime consultationDate, String eventType) {
        validateInput(question, eventType);

        long timestamp = System.currentTimeMillis();
        String requestBody = buildRequestBody(user, question, timestamp, eventType);
        String signature = generateSignature(requestBody, props.getKey());
        String apiResponse = callClovaApi(requestBody, signature, timestamp);

        Map<String, Object> parsedResponse = parseResponseWithButtons((long) user.getUser_id(), apiResponse);

        // Handle reservation confirmation
        if (question != null && (question.startsWith("UnexpiredForm") || "네".equals(question))) {
            parsedResponse = handleReservationConfirmation(user, acaId, consultationDate, parsedResponse);
        }

        return parsedResponse;
    }

    private Map<String, Object> handleReservationConfirmation(UsersEntity user, String acaId, LocalDateTime consultationDate, Map<String, Object> response) {
        // 불변 맵을 가변 맵으로 변환
        Map<String, Object> mutableResponse = new HashMap<>(response);

        if (consultationDate == null) {
            mutableResponse.put("text", "상담 날짜가 지정되지 않아 예약이 불가능합니다. 날짜를 선택해 주세요.");
            mutableResponse.put("buttons", Collections.emptyList());
            log.warn("Consultation date is null for userId: {}, acaId: {}", user.getUser_id(), acaId);
        } else if (acaId == null || acaId.trim().isEmpty()) {
            mutableResponse.put("text", "학원 ID가 지정되지 않았습니다.");
            mutableResponse.put("buttons", Collections.emptyList());
        } else {
            AcademiesEntity academy = AcademiesEntity.builder().academyId(Integer.parseInt(acaId)).build();
            mutableResponse.put("text", "해당 요일 및 시간에 예약이 완료되었습니다.");
            mutableResponse.put("buttons", Collections.emptyList());
            saveConsultation(user, academy, consultationDate);
        }

        return mutableResponse;
    }

    private void validateInput(String question, String eventType) {
        if (!EVENT_TYPE_OPEN.equals(eventType) && (question == null || question.trim().isEmpty())) {
            throw new ChatbotException("질문 내용이 비어있습니다.");
        }
    }

    private String buildRequestBody(UsersEntity user, String question, long timestamp, String eventType) {
        Map<String, Object> request = new HashMap<>();
        request.put("version", API_VERSION);
        request.put("userId", String.valueOf(user.getUser_id()));
        request.put("timestamp", timestamp);
        request.put("event", eventType);

        if (EVENT_TYPE_SEND.equals(eventType) && question != null) {
            request.put("bubbles", List.of(Map.of("type", "text", "data", Map.of("description", question))));
        }

        try {
            return objectMapper.writeValueAsString(request);
        } catch (JsonProcessingException e) {
            throw new ChatbotException("요청 본문 생성 중 오류 발생", e);
        }
    }

    private String generateSignature(String body, String secretKey) {
        try {
            SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(key);
            return Base64.getEncoder().encodeToString(mac.doFinal(body.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new ChatbotException("보안 서명 생성 실패", e);
        }
    }

    private String callClovaApi(String body, String signature, long timestamp) {
        try {
            return clovaWebClient.post()
                    .uri(props.getUrl())
                    .headers(headers -> {
                        headers.set("X-NCP-CHATBOT_SIGNATURE", signature);
                        headers.set("X-NCP-APIGW-API-KEY", props.getApiGatewayKey());
                        headers.set("X-NCP-APIGW-TIMESTAMP", String.valueOf(timestamp));
                        headers.setContentType(MediaType.APPLICATION_JSON);
                    })
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (WebClientResponseException e) {
            throw new ChatbotException(handleApiError(e), e);
        }
    }

    private Map<String, Object> parseResponseWithButtons(Long userId, String response) {
        log.debug("Received response: {}", response);

        try {
            Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
            List<Map<String, Object>> bubbles = (List<Map<String, Object>>) responseMap.get("bubbles");

            if (isInvalidBubbleResponse(bubbles)) {
                return new HashMap<>(Map.of("text", "죄송합니다. 챗봇 응답이 비어 있습니다.", "buttons", Collections.emptyList()));
            }

            Map<String, Object> firstBubble = bubbles.get(0);
            String type = (String) firstBubble.get("type");
            Map<String, Object> data = (Map<String, Object>) firstBubble.get("data");

            if (type == null || data == null) {
                log.warn("Invalid bubble structure - type: {}, data: {}", type, data);
                return new HashMap<>(Map.of("text", "죄송합니다. 응답 형식이 올바르지 않습니다.", "buttons", Collections.emptyList()));
            }

            String text = extractTextFromBubble(type, data);
            List<Map<String, String>> buttons = extractButtonsFromBubble(data);

            log.debug("Extracted text: {}, Extracted buttons: {}", text, buttons);

            text = text != null ? text.trim() : "처리할 수 없는 응답 형식";
            return new HashMap<>(Map.of("text", text, "buttons", buttons));
        } catch (JsonProcessingException e) {
            log.error("Failed to parse response: {}", response, e);
            return new HashMap<>(Map.of("text", "응답 파싱 오류", "buttons", Collections.emptyList()));
        }
    }

    private boolean isInvalidBubbleResponse(List<Map<String, Object>> bubbles) {
        return bubbles == null || bubbles.isEmpty() || bubbles.get(0) == null || bubbles.get(0).isEmpty();
    }

    private String extractTextFromBubble(String type, Map<String, Object> data) {
        if ("text".equalsIgnoreCase(type)) {
            return (String) data.get("description");
        } else if ("template".equalsIgnoreCase(type)) {
            Map<String, Object> cover = (Map<String, Object>) data.get("cover");
            if (cover != null && "text".equalsIgnoreCase((String) cover.get("type"))) {
                Map<String, Object> coverData = (Map<String, Object>) cover.get("data");
                return coverData != null ? (String) coverData.get("description") : null;
            }
        }
        return null;
    }

    private List<Map<String, String>> extractButtonsFromBubble(Map<String, Object> data) {
        List<Map<String, String>> buttons = new ArrayList<>();
        List<List<Map<String, Object>>> contentTable = (List<List<Map<String, Object>>>) data.get("contentTable");

        if (contentTable != null) {
            for (List<Map<String, Object>> row : contentTable) {
                for (Map<String, Object> cell : row) {
                    Map<String, Object> cellData = (Map<String, Object>) cell.get("data");
                    if (cellData != null && "button".equalsIgnoreCase((String) cellData.get("type"))) {
                        String title = (String) cellData.get("title");
                        Map<String, Object> buttonData = (Map<String, Object>) cellData.get("data");
                        if (buttonData != null) {
                            Map<String, Object> action = (Map<String, Object>) buttonData.get("action");
                            if (action != null) {
                                String actionType = (String) action.get("type");
                                if ("postback".equalsIgnoreCase(actionType)) {
                                    Object dataObject = action.get("data");
                                    String postback = null;
                                    if (dataObject instanceof Map) {
                                        postback = (String) ((Map<String, Object>) dataObject).get("postback");
                                    } else if (dataObject instanceof String) {
                                        postback = (String) dataObject;
                                    }
                                    if (title != null && postback != null) {
                                        buttons.add(Map.of("title", title, "action", postback));
                                        log.debug("Added button - title: {}, action: {}", title, postback);
                                    } else {
                                        log.warn("Invalid postback data - title: {}, dataObject: {}", title, dataObject);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            log.debug("No contentTable found in response data");
        }

        return buttons;
    }

    private void saveConsultation(UsersEntity user, AcademiesEntity acaId, LocalDateTime consultationDate) {
        ChatBotEntity consultation = ChatBotEntity.builder()
                .user(user)
                .acaId(acaId)
                .consultationDate(consultationDate)
                .build();
        messageRepo.save(consultation);
        log.info("Consultation saved: userId={}, acaId={}, date={}", user.getUser_id(), acaId.getAcademyId(), consultationDate);
    }

    private String handleApiError(WebClientResponseException e) {
        String errorBody = e.getResponseBodyAsString();
        log.error("API Error Response: {}", errorBody);
        return switch (e.getStatusCode().value()) {
            case 401 -> "인증 오류: API 키 또는 시그니처가 잘못되었습니다.";
            case 403 -> "권한 오류: API 접근 권한이 없습니다.";
            case 400, 500 -> "오류: " + extractErrorMessage(errorBody);
            default -> "챗봇 서비스 연결 오류 (" + e.getStatusCode().value() + ")";
        };
    }

    private String extractErrorMessage(String responseBody) {
        try {
            Map<String, Object> errorResponse = objectMapper.readValue(responseBody, Map.class);
            return (String) errorResponse.getOrDefault("message", "알 수 없는 오류");
        } catch (Exception e) {
            return responseBody;
        }
    }

    public static class ChatbotException extends RuntimeException {
        public ChatbotException(String message) {
            super(message);
        }

        public ChatbotException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}