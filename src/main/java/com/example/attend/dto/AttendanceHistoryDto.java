package com.example.attend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AttendanceHistoryDto {
    private int attendanceId;
    private String studentName;
    private String status;
    private String memo;
    private LocalDateTime verifiedAt;
}
