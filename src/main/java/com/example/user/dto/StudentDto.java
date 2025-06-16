package com.example.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class StudentDto {
    private int userId;
    private int studentId;
    private String username;
    private String name;
    private String userProfile;
    private String phone;
    private Integer grade;
    private String room;

    private String regDate; // 학생 계정 생성일(yyyy-MM-dd)
    // 소속 클래스들
    private List<String> classNames;
    private List<Integer> classIds;
    private String parentName;
    private String parentPhone; // 학부모 연락처

    private String schoolName; // 소속 학교명

    private List<String> teacherNames; // 담당 강사 명들
    private List<String> teacherSubjects; // 담당 과목들

    public StudentDto(int studentId, String name) {
        this.studentId = studentId;
        this.name = name;
    }
}
