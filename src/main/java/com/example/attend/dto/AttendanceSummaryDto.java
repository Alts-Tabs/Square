package com.example.attend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AttendanceSummaryDto {
    private int timetableAttendId;      // timetable_attend의 PK
    private LocalDateTime attendStart;  // 출석 시작 시간
    private String status; // "PRESENT", "ABSENT", "LATE"
    private int count; // 추가함
}
