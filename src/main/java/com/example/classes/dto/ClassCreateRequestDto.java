package com.example.classes.dto;

import lombok.Data;

@Data
public class ClassCreateRequestDto {
    private int teacherId;
    private String name; // 클래스명
    private Integer capacity; // 정원 - default: 30
}
