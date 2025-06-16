package com.example.attend.controller;

import com.example.attend.dto.AttendanceHistoryDto;
import com.example.attend.dto.StartAttendanceResponseDto;
import com.example.attend.service.AttendanceHistoryService;
import com.example.attend.service.AttendanceService;
import com.example.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final AttendanceHistoryService attendanceHistoryService;

    // 출석 시작 ========================================================================================================
    @PostMapping("/th/attendance-start")
    public StartAttendanceResponseDto startAttendance(@AuthenticationPrincipal CustomUserDetails userDetails) {
        System.out.println("startAttendance");
        return attendanceService.startAttendance(userDetails.getUserId());
    }

    // 출석 종료 ========================================================================================================
    @PostMapping("/th/{timetableAttendIdx}/attendance-end")
    public void endAttendance(@PathVariable int timetableAttendIdx) {
        System.out.println("출석 종료 요청 들어옴: " + timetableAttendIdx);
        attendanceService.endAttendance(timetableAttendIdx);
    }

    // 출석 취소 ========================================================================================================
    @PostMapping("/th/{timetableAttendIdx}/attendance-cancel")
    public void cancelAttendance(@PathVariable int timetableAttendIdx) {
        System.out.println("출석 취소 요청 들어옴: " + timetableAttendIdx);
        attendanceService.cancelAttendance(timetableAttendIdx);
    }

    // 지난 출석 출력 ====================================================================================================
    @GetMapping("/public/attendance-history")
    public List<AttendanceHistoryDto> getAttendanceHistory() {
        return attendanceHistoryService.getAllAttendanceSummary();
    }


    // 출석 입력란 활성화 여부 ============================================================================================
    @GetMapping("/student/attendance-active")
    public ResponseEntity<Boolean> isAttendanceActive(@AuthenticationPrincipal CustomUserDetails userDetails) {
        boolean isActive = attendanceService.isAttendanceActive(userDetails.getUserId());
        return ResponseEntity.ok(isActive);
    }


    // 출석 제출 ========================================================================================================
    @PostMapping("/student/attendance-submit")
    public ResponseEntity<Boolean> submitAttendanceCode(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam int submittedCode
    ) {
        boolean result = attendanceService.submitAttendanceCode(userDetails.getUserId(), submittedCode);
        return ResponseEntity.ok(result);
    }
}