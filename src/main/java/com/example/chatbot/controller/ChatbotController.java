package com.example.chatbot.controller;


import com.example.chatbot.Dto.ChatBotDto;
import com.example.chatbot.entity.ChatBotEntity;
import com.example.chatbot.repository.ChatBotMessageRepository;
import com.example.user.entity.UsersEntity;
import com.example.user.jpa.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consultation")
public class ChatbotController {

    private final ChatBotMessageRepository  chatBotMessageRepository;
    private final UsersRepository usersRepository;

    // 상담 예약 생성
    @PostMapping
    public ResponseEntity<?> createConsultation(
            @RequestBody ChatBotDto dto,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        String username = authentication.getName();
        UsersEntity user = usersRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        // 날짜 유효성 검사
        if (dto.getConsultationDateTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot book past dates"));
        }

        ChatBotEntity consultation = ChatBotEntity.builder()
                .user(user)
                .consultationDate(Timestamp.valueOf(dto.getConsultationDateTime()))
                .build();

        chatBotMessageRepository.save(consultation);
        return ResponseEntity.ok(Map.of("message", "Consultation created successfully"));
    }

    // 사용자의 상담 예약 목록 조회
    @GetMapping
    public ResponseEntity<?> getUserConsultations(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        String username = authentication.getName();
        UsersEntity user = usersRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        List<ChatBotEntity> consultations = chatBotMessageRepository.findByUserOrderByConsultationDateDesc(user);
        return ResponseEntity.ok(consultations);
    }
}