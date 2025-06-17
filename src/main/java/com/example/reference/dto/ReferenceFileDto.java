package com.example.reference.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferenceFileDto {
    private Long id;
    private String originalFilename;
    private String storedFilename;
}