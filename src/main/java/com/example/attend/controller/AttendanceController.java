package com.example.attend.controller;

import com.example.attend.dto.AttendanceHistoryDto;
import com.example.attend.dto.AttendanceHistoryUpdateDto;
import com.example.attend.dto.AttendanceSummaryDto;
import com.example.attend.dto.StartAttendanceResponseDto;
import com.example.attend.service.AttendanceHistoryService;
import com.example.attend.service.AttendanceService;
import com.example.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
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


    // 출석 입력란 활성화 여부 ============================================================================================
    @GetMapping("/student/attendance-active")
    public ResponseEntity<Integer> isAttendanceActive(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Integer isActive = attendanceService.isAttendanceActive(userDetails.getUserId());
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


    // 지난 출석 전체 출력 (Attend.js) ===================================================================================
    @GetMapping("/public/{timetableId}/{classId}/attendance-summary")
    public ResponseEntity<List<AttendanceSummaryDto>> getAttendanceSummary(
            @PathVariable int timetableId, @PathVariable int classId) {
        List<AttendanceSummaryDto> summaryList = attendanceHistoryService.getAttendanceSummary(timetableId, classId);
        return ResponseEntity.ok(summaryList);
    }


    // 지난 출석 상세 출력 (AttendHistory.js) =============================================================================
    @GetMapping("/public/{timetableAttendIdx}/attendance-history")
    public ResponseEntity<List<AttendanceHistoryDto>> getAttendanceHistory(
            @PathVariable int timetableAttendIdx) {
        List<AttendanceHistoryDto> history = attendanceHistoryService.getAttendanceHistory(timetableAttendIdx);
        return ResponseEntity.ok(history); // 하나의 timetableIdx에 대해서만 출석 기록을 가져옴.
    }


    // 지난 출석 상세 수정 (AttendHistory.js) =============================================================================
    @PutMapping("/th/attendance-history")
    public ResponseEntity<Void> updateAttendanceHistory(
            @RequestBody AttendanceHistoryUpdateDto updates) {
        attendanceHistoryService.updateAttendanceHistory(updates);
        return ResponseEntity.ok().build();
    }

}