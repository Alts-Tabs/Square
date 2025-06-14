package com.example.attend.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAttendanceResponseDto { // [ 학생 출석 응답 ]
    private String status;   // PRESENT, ABSENT, LATE
    private String message;  // Ex) "출석이 완료되었습니다.", "출석 번호가 일치하지 않습니다."
}
