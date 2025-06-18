package com.example.attend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttendanceRankingDto {
    private StudentSummaryDto attendanceKing;
    private StudentSummaryDto needEffortKing;
}
