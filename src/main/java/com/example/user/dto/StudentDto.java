package com.example.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentDto {
    private int studentId;
    private String username;
    private String name;
    private String phone;
    private Integer grade;
    private String room;
}
