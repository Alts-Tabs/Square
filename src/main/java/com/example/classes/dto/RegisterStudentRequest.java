package com.example.classes.dto;

import lombok.Data;

@Data
public class RegisterStudentRequest {
    private int classId;
    private int studentId;
}
