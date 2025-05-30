package com.example.chatbot.controller;

import com.example.chatbot.repository.ChatBotMessageRepository;
import com.example.chatbot.service.ChatbotService;
import com.example.chatbot.entity.ChatBotEntity;
import com.example.user.entity.UsersEntity;
import com.example.user.jpa.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public/api/chatbot")
public class ChatbotAPIController {

    private final UsersRepository usersRepository;
    private final ChatbotService chatbotService;
    private final ChatBotMessageRepository chatBotMessageRepository;

    @PostMapping
    public ResponseEntity<?> handleChatbotMessage(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        String message = request.get("message");
        String username = authentication.getName();
        UsersEntity user = usersRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        try {
            String response = chatbotService.ask(user, message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Clova Chatbot error: " + e.getMessage()));
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<?> getChatHistory(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        String username = authentication.getName();
        UsersEntity user = usersRepository.findByUsername(username);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        List<ChatBotEntity> messages = chatBotMessageRepository.findByUserOrderByCreatedAtAsc(user);
        return ResponseEntity.ok(messages);
    }
}