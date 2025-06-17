package com.example.reference.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponseDto {
    private Long idx;
    private String category;
}
