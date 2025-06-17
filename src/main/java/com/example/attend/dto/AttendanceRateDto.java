package com.example.attend.dto;

public class AttendanceRateDto {
    private int timetableId;
    private double attendanceRate; // 전체 수업의 평균 출석률 (%)
    private String bestStudentName; // 출석률 가장 높은 학생
    private String worstStudentName; // 출석률 가장 낮은 학생
}
