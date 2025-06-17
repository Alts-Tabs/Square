package com.example.reference.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ReferenceDto {
    private Long id;            // 게시글 ID
    private String title;       // 제목
    private String content;     // 내용
    private String writer;      // 글쓴이
    private Long categoryIdx; // 소속 카테고리 식별값
    private List<ReferenceFileDto> files; // 원본 명 + 파일 주소
    private String createdAt; // 업로드일
}
