package com.example.chatbot.controller;

import com.example.chatbot.entity.ChatBotEntity;
import com.example.chatbot.repository.ChatBotMessageRepository;
import com.example.chatbot.service.ChatbotService;
import com.example.user.entity.UsersEntity;
import com.example.user.jpa.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/public/api/chatbot")
@RequiredArgsConstructor
public class ChatbotAPIController {

    private final UsersRepository usersRepository;
    private final ChatbotService chatbotService;
    private final ChatBotMessageRepository chatBotMessageRepository;

    @PostMapping
    public ResponseEntity<?> handleChatbotMessage(
            Authentication authentication,
            @RequestParam(required = false) String acaId,
            @RequestParam(required = false) String consultationDate,
            @RequestParam String eventType,
            @RequestBody(required = false) Map<String, Object> requestBody) {

        log.debug("Received request - acaId: {}, consultationDate: {}, eventType: {}, requestBody: {}",
                acaId, consultationDate, eventType, requestBody);

        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Unauthorized access attempt");
            return ResponseEntity.status(401).body(Map.of(
                    "message", "인증이 필요합니다. 다시 로그인해주세요.",
                    "errorCode", "UNAUTHORIZED"
            ));
        }

        UsersEntity user = getAuthenticatedUser(authentication);
        if (user == null) {
            log.warn("User not found for authentication: {}", authentication.getName());
            return ResponseEntity.status(404).body(Map.of(
                    "message", "사용자를 찾을 수 없습니다.",
                    "errorCode", "USER_NOT_FOUND"
            ));
        }

        try {
            LocalDateTime consultationDateTime = parseConsultationDate(consultationDate);
            log.debug("Parsed consultationDateTime: {}", consultationDateTime);
            if (consultationDateTime != null && consultationDateTime.isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "과거 날짜로는 예약할 수 없습니다.",
                        "errorCode", "INVALID_DATE"
                ));
            }
            String message = extractMessage(requestBody);
            Map<String, Object> response = chatbotService.ask(user, message, acaId, consultationDateTime, eventType);

            // 불변 맵을 가변 맵으로 복사
            Map<String, Object> mutableResponse = new HashMap<>(response);

            // eventType이 "open"일 경우 "상담예약" 버튼 추가 (Clova 버튼이 없는 경우)
            if ("open".equals(eventType) && !mutableResponse.containsKey("buttons")) {
                mutableResponse.put("buttons", List.of(Map.of("title", "상담예약", "action", "상담 예약")));
            }

            // consultationDate가 있고, 응답에 "완료"가 포함되지 않은 경우 "네/아니오" 버튼 추가 (Clova 버튼이 없는 경우)
            if (consultationDateTime != null && !mutableResponse.getOrDefault("text", "").toString().contains("완료")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> buttons = (List<Map<String, Object>>) mutableResponse.get("buttons");
                if (buttons == null || buttons.isEmpty()) {
                    DayOfWeek dayOfWeek = consultationDateTime.getDayOfWeek();
                    String timeValidation = validateTime(consultationDateTime, dayOfWeek);
                    if (timeValidation != null) {
                        mutableResponse.put("text", mutableResponse.getOrDefault("text", "") + "\n" + timeValidation);
                    }
                    if (buttons == null || buttons.isEmpty()) {
                        mutableResponse.put("buttons", List.of(
                                Map.of("title", "예", "action", "네"),
                                Map.of("title", "아니오", "action", "아니오")
                        ));
                    }
                }
            }

            log.debug("Final response: {}", mutableResponse);
            return ResponseEntity.ok(mutableResponse);
        } catch (ChatbotService.ChatbotException e) {
            log.error("Chatbot error: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                    "message", e.getMessage(),
                    "errorCode", "CHATBOT_ERROR"
            ));
        } catch (Exception e) {
            log.error("Unexpected error: ", e);
            return ResponseEntity.status(500).body(Map.of(
                    "message", "서버 내부 오류가 발생했습니다.",
                    "errorCode", "INTERNAL_SERVER_ERROR"
            ));
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<?> getChatHistory(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Unauthorized access attempt for chat history");
            return ResponseEntity.status(401).body(Map.of(
                    "message", "인증이 필요합니다. 다시 로그인해주세요.",
                    "errorCode", "UNAUTHORIZED"
            ));
        }

        UsersEntity user = getAuthenticatedUser(authentication);
        if (user == null) {
            log.warn("User not found for authentication: {}", authentication.getName());
            return ResponseEntity.status(404).body(Map.of(
                    "message", "사용자를 찾을 수 없습니다.",
                    "errorCode", "USER_NOT_FOUND"
            ));
        }

        List<ChatBotEntity> messages = chatBotMessageRepository.findByUserOrderByCreatedAtAsc(user);
        return ResponseEntity.ok(messages);
    }

    private UsersEntity getAuthenticatedUser(Authentication authentication) {
        String username = authentication.getName();
        return usersRepository.findByUsername(username);
    }

    private LocalDateTime parseConsultationDate(String consultationDate) {
        if (consultationDate == null || consultationDate.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDateTime.parse(consultationDate);
        } catch (DateTimeParseException e) {
            log.warn("Failed to parse consultationDate: {}, error: {}", consultationDate, e.getMessage());
            throw new ChatbotService.ChatbotException("잘못된 날짜 형식: " + consultationDate);
        }
    }

    private String extractMessage(Map<String, Object> requestBody) {
        if (requestBody == null || !requestBody.containsKey("message")) {
            return null;
        }
        return requestBody.get("message").toString();
    }

    private String validateTime(LocalDateTime dateTime, DayOfWeek dayOfWeek) {
        int hour = dateTime.getHour();
        switch (dayOfWeek) {
            case SATURDAY:
                if (hour < 9 || hour >= 17) {
                    return "토요일의 경우 오전 9시부터 오후 5시까지만 가능합니다.";
                }
                break;
            case SUNDAY:
                if (hour < 9 || hour >= 13) {
                    return "일요일의 경우 오전 9시부터 오후 1시까지만 가능합니다.";
                }
                break;
            default:
                // 평일은 제한 없음
                break;
        }
        return null; // 유효한 시간
    }
}