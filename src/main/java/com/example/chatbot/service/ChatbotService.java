package com.example.chatbot.service;

import com.example.chatbot.config.ClovaChatbotConfig;
import com.example.chatbot.entity.ChatBotEntity;
import com.example.chatbot.repository.ChatBotMessageRepository;
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
import java.sql.Timestamp;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final WebClient clovaWebClient;
    private final ClovaChatbotConfig.ChatbotProps props;
    private final ChatBotMessageRepository messageRepo;
    private final ObjectMapper objectMapper;

    @Transactional
    public String ask(UsersEntity user, String question) {
        if (question == null || question.trim().isEmpty()) {
            throw new IllegalArgumentException("질문 내용이 비어있습니다.");
        }

        try {
            // 1. 타임스탬프 생성 (바디와 헤더에서 동일하게 사용)
            long timestamp = System.currentTimeMillis();

            // 2. Request body 생성
            String body = createRequestBody(user, question, timestamp);

            // 3. 시그니처 생성 (Secret Key 사용)
            String signature = makeSignature(body, props.getKey()); // 수정: props.getApiGatewayKey() -> props.getKey()

            // 4. API 호출
            String response = callClovaApi(body, signature, timestamp);

            // 5. 응답 파싱
            String answer = parseResponse(response);

            // 6. 대화 로그 저장
            saveMessages(user, question, answer);

            return answer;

        } catch (WebClientResponseException e) {
            log.error("Clova API 호출 실패: status={}, body={}", e.getRawStatusCode(), e.getResponseBodyAsString());
            String errorMessage = switch (e.getRawStatusCode()) {
                case 401 -> "인증 오류: API 키 또는 시그니처가 잘못되었습니다.";
                case 403 -> "권한 오류: API 접근 권한이 없습니다.";
                case 400 -> "요청 오류: 입력 형식을 확인해주세요.";
                default -> "챗봇 서비스 연결 오류: " + e.getMessage();
            };
            throw new RuntimeException(errorMessage);
        } catch (Exception e) {
            log.error("챗봇 서비스 처리 중 오류 발생", e);
            throw new RuntimeException("챗봇 서비스 처리 중 오류가 발생했습니다.");
        }
    }

    private String createRequestBody(UsersEntity user, String question, long timestamp) throws JsonProcessingException {
        Map<String, Object> request = Map.of(
                "version", "v2",
                "userId", String.valueOf(user.getUser_id()),
                "timestamp", timestamp, // 수정: 동일한 타임스탬프 사용
                "bubbles", new Object[]{
                        Map.of(
                                "type", "text",
                                "data", Map.of("description", question)
                        )
                },
                "event", "send"
        );
        return objectMapper.writeValueAsString(request);
    }

    private String callClovaApi(String body, String signature, long timestamp) {
        return clovaWebClient.post()
                .uri(props.getUrl())
                .header("X-NCP-CHATBOT_SIGNATURE", signature)
                .header("X-NCP-APIGW-API-KEY", props.getApiGatewayKey())
                .header("X-NCP-APIGW-TIMESTAMP", String.valueOf(timestamp)) // 수정: 타임스탬프 헤더 추가
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    private String parseResponse(String response) throws JsonProcessingException {
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        List<Map<String, Object>> bubbles = (List<Map<String, Object>>) responseMap.get("bubbles");

        if (bubbles == null || bubbles.isEmpty()) {
            log.warn("챗봇 응답에 bubble이 없습니다: {}", response);
            return "죄송합니다. 응답을 처리할 수 없습니다.";
        }

        Map<String, Object> data = (Map<String, Object>) bubbles.get(0).get("data");
        return data != null ? (String) data.get("description") : "응답 처리 중 오류가 발생했습니다.";
    }

    private void saveMessages(UsersEntity user, String question, String answer) {
        // 사용자 메시지 저장
        messageRepo.save(ChatBotEntity.builder()
                .user(user)
                .message(question)
                .isBot(false)
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build());

        // 챗봇 응답 저장
        messageRepo.save(ChatBotEntity.builder()
                .user(user)
                .message(answer)
                .isBot(true)
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build());
    }

    private String makeSignature(String message, String secret) {
        try {
            SecretKeySpec key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(key);
            byte[] raw = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(raw);
        } catch (Exception e) {
            log.error("시그니처 생성 실패", e);
            throw new IllegalStateException("보안 서명 생성에 실패했습니다.", e);
        }
    }
}