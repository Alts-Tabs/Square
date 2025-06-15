package com.example.attend.controller;

import com.example.attend.dto.AttendanceHistoryDto;
import com.example.attend.dto.StartAttendanceResponseDto;
import com.example.attend.service.AttendanceService;
import com.example.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class AttendanceController {

    private final AttendanceService attendanceService;

    // 출석 시작 ========================================================================================================
    @PostMapping("/th/attendance-start")
    public StartAttendanceResponseDto startAttendance(@AuthenticationPrincipal CustomUserDetails userDetails) {
        System.out.println("startAttendance");
        return attendanceService.startAttendance(userDetails.getUserId());
    }

    // 출석 종료 ========================================================================================================
    @PostMapping("/th/{timetableAttendIdx}/attendance-end")
    public void endAttendance(@PathVariable int timetableAttendIdx) {
        attendanceService.endAttendance(timetableAttendIdx);
    }


    // 출석 제출 ========================================================================================================
//    @PostMapping("/stu/attendance-submit")
//    public void submitAttendance(
//            @RequestParam int studentId,
//            @RequestParam int idx,
//            @RequestParam int inputCode
//    ) {
//        attendanceService.submitAttendance(studentId, idx, inputCode);
//    }

    // 이전 출석 조회 ====================================================================================================
//    @GetMapping("/attendance-history/{codeIdx}")
//    public AttendanceHistoryDto getAttendanceHistory(@PathVariable int codeIdx) {
//        return attendanceService.getAttendanceHistory(codeIdx);
//    }
}
