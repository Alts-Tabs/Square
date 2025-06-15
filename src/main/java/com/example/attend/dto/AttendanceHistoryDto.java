package com.example.attend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttendanceHistoryDto {
    private String dateOnly;  // Ex) "25.05.09 금요일"
    private long present;
    private long late;
    private long absent;
    private int timetableId; // 어떤 수업의 출석인지 프론트에서 구분용
}
