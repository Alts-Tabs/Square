package com.example.chatbot.Dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatBotDto {
    private String username;
    private Long userId;
    private int acaId;
    private LocalDateTime consultationDateTime;
}