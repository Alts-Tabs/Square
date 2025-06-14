package com.example.attend.controller;

import com.example.attend.dto.AttendanceHistoryDto;
import com.example.attend.dto.StartAttendanceResponseDto;
import com.example.attend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // 출석 시작 ======================================================================
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @PostMapping("/attendance-start")
    public StartAttendanceResponseDto startAttendance(@RequestParam Integer userId) {
        return attendanceService.startAttendance(userId);
    }

    // 출석 종료 ======================================================================
    @PostMapping("/attendance-end")
    public void endAttendance(@RequestParam int timetableIdx) {
        attendanceService.endAttendance(timetableIdx);
    }

    // 출석 제출 ======================================================================
    @PostMapping("/stu/attendance-submit")
    public void submitAttendance(
            @RequestParam int studentId,
            @RequestParam int idx,
            @RequestParam int inputCode
    ) {
        attendanceService.submitAttendance(studentId, idx, inputCode);
    }

    // 출석 히스토리 조회 ===============================================================
    @GetMapping("/attendance-history/{codeIdx}")
    public AttendanceHistoryDto getAttendanceHistory(@PathVariable int codeIdx) {
        return attendanceService.getAttendanceHistory(codeIdx);
    }
}
