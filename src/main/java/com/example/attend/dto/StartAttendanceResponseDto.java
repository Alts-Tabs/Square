package com.example.attend.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartAttendanceResponseDto { // [ 강사 출석 시작 (응답) ]
    private int idx;
    private int code;
}

