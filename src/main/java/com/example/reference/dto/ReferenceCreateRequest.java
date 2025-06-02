package com.example.reference.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferenceCreateRequest {
    private String title;
    private String content;
    private String writer;
    private String filePath; // 첨부 파일 경로 (null 가능)
}
