package com.example.attend.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAttendanceRequestDto { // [ 학생 출석 요청 ]
    private int studentId;
    private int code; // 학생이 입력한 출석 번호
}
