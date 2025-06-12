package com.example.chatbot.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ConsultationDto {
    private Long id;
    private String name;
    private LocalDateTime consultationDate;
}
