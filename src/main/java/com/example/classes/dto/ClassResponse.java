package com.example.classes.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassResponse {
    private int id;
    private String name;
    private int capacity;
    private int tuition;
    private String teacherName;
    private int teacherId;
}
