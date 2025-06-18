package com.example.board.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BoardResponseDto {
    private Long id;
    private String title;
    private String content;
    private String author;
    private String category;
    private String division;
    private boolean isMemberOnly;
    private boolean allowComments;
    private boolean isSecret;
    private int views;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> fileUrls;
    private List<String> fileNames;
}