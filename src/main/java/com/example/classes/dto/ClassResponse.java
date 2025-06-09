package com.example.classes.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassResponse {
    private int id;
    private String name;
    private int currentCount; // 현재 인원 수
    private int capacity; // 정원 수
    private int tuition;
    private String teacherName;
    private int teacherId;
}
