package com.example.reference.dto;

import com.example.reference.entity.ReferenceReplyEntity;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferenceReplyDto {
    private Long id;
    private Long referenceId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReferenceReplyDto fromEntity(ReferenceReplyEntity entity) {
        return ReferenceReplyDto.builder()
                .id(entity.getId())
                .referenceId(entity.getReference().getId())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
