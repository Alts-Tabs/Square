package com.example.attend.dto;

import lombok.Data;

@Data
public class AttendanceHistoryUpdateDto {
    private int attendanceId;
    private String status;
    private String memo;
}

