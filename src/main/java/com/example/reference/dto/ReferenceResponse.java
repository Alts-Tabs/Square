package com.example.reference.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
public class ReferenceResponse {
    private Long id;
    private String title;
    private String content;
    private String writer;
    private String category; // 필터링 위한 값
    private String filePath;
    private String createdAt;
    private String updatedAt;
}