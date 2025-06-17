package com.example.reference.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReferenceUpdateRequestDto {
    private String title;
    private String content;
    private Long categoryIdx;
    private List<Long> deleteFileIds; // 삭제할 파일 경로들
    private List<MultipartFile> files;
}
