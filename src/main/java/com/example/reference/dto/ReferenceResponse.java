package com.example.reference.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferenceResponse {
    private Long id;
    private String title;
    private String content;
    private String writer;
    private String filePath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
