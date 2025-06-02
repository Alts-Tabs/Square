package com.example.reference.dto;

import com.example.reference.entity.ReferenceEntity;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferenceDto {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private List<ReferenceFileDto> files;

    public static ReferenceDto fromEntity(ReferenceEntity entity) {
        List<ReferenceFileDto> fileDtos = entity.getFiles().stream()
                .map(f -> ReferenceFileDto.builder()
                        .id(f.getId())
                        .originalFilename(f.getOriginalFilename())
                        .storedFilename(f.getStoredFilename())
                        .build())
                .collect(Collectors.toList());

        return ReferenceDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .files(fileDtos)
                .build();
    }
}
