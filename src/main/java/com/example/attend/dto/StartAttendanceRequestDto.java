package com.example.attend.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartAttendanceRequestDto { // [ 강사 출석 시작 (요청) ]
    private int timetableId;
}