package com.example.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TeacherListDto {
    private int teacherId;
    private String name;
    private String email;
    private String subject;
    private String userProfile;
    private String phone;
}
