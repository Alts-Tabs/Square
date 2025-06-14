package com.example.attend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceHistoryDto {
    private String date;
    private int presentCount;
    private int lateCount;
    private int absentCount;
    private List<StudentStatus> studentStatuses;

    @Data
    @AllArgsConstructor
    public static class StudentStatus {
        private String name;
        private String status; // "PRESENT", "LATE", "ABSENT"
    }
}
