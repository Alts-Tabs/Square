package com.example.chatbot.controller;

import com.example.chatbot.Dto.ChatBotDto;
import com.example.chatbot.entity.ChatBotEntity;
import com.example.chatbot.repository.ChatBotMessageRepository;
import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.UsersEntity;
import com.example.user.jpa.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public/api/consultation")
public class ChatbotController {

    private final ChatBotMessageRepository chatBotMessageRepository;
    private final UsersRepository usersRepository;

    @PostMapping
    public ResponseEntity<?> createConsultation(
            @RequestBody ChatBotDto dto,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of(
                    "message", "인증이 필요합니다. 다시 로그인해주세요.",
                    "errorCode", "UNAUTHORIZED"
            ));
        }

        String username = authentication.getName();
        UsersEntity user = usersRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "사용자를 찾을 수 없습니다.",
                    "errorCode", "USER_NOT_FOUND"
            ));
        }

        if (dto.getConsultationDateTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "과거 날짜로는 예약할 수 없습니다.",
                    "errorCode", "INVALID_DATE"
            ));
        }

        AcademiesEntity academy = AcademiesEntity.builder().academyId(dto.getAcaId()).build();
        ChatBotEntity consultation = ChatBotEntity.builder()
                .user(user)
                .acaId(academy)
                .consultationDate(dto.getConsultationDateTime())
                .build();

        chatBotMessageRepository.save(consultation);
        return ResponseEntity.ok(Map.of(
                "message", "Consultation created successfully",
                "username", username,
                "userId", user.getUser_id(),
                "acaId", dto.getAcaId(),
                "consultationDate", dto.getConsultationDateTime()
        ));
    }

    @GetMapping
    public ResponseEntity<?> getUserConsultations(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of(
                    "message", "인증이 필요합니다. 다시 로그인해주세요.",
                    "errorCode", "UNAUTHORIZED"
            ));
        }

        String username = authentication.getName();
        UsersEntity user = usersRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of(
                    "message", "사용자를 찾을 수 없습니다.",
                    "errorCode", "USER_NOT_FOUND"
            ));
        }

        List<ChatBotEntity> consultations = chatBotMessageRepository.findByUserOrderByConsultationDateDesc(user);
        List<ChatBotDto> consultationDtos = consultations.stream().map(c -> {
            ChatBotDto dto = new ChatBotDto();
            dto.setUsername(username);
            dto.setUserId((long) user.getUser_id());
            dto.setAcaId(c.getAcaId().getAcademyId());
            dto.setConsultationDateTime(c.getConsultationDate());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(consultationDtos);
    }
}