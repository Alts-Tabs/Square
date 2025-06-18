package com.example.board.dto;

import lombok.Data;

import java.util.List;

@Data
public class BoardRequestDto {
    private String title;
    private String content;
    private String category;
    private String division;
    private boolean allowComments;
    private List<String> fileNames; // NCP에 업로드된 파일 이름
}