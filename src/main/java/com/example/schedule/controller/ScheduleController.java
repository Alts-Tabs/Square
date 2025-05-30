package com.example.schedule.controller;

import com.example.schedule.dto.ScheduleResponse;
import com.example.schedule.dto.ScheduleSaveRequest;
import com.example.schedule.service.ScheduleService;
import com.example.schedule.dto.SchoolsSimpleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class ScheduleController {
    private final ScheduleService scheduleService;

    // 모든 학원 목록 출력
    @GetMapping("/public/schools")
    public ResponseEntity<List<SchoolsSimpleDto>> getAllSchools() {
        return ResponseEntity.ok(scheduleService.getAllSchools());
    }

    // 학원에 스케줄 등록된 목록만 출력
    @GetMapping("/public/{academyId}/schools")
    public ResponseEntity<List<SchoolsSimpleDto>> getSchoolsByAcademy(@PathVariable int academyId) {
        return ResponseEntity.ok(scheduleService.getSchoolsByAcademyId(academyId));
    }

    // 학원 스케줄 저장
    @PostMapping("/th/schedule/save")
    public ResponseEntity<Void> saveSchedule(@RequestBody ScheduleSaveRequest dto) {
        scheduleService.saveSchedule(dto);
        return ResponseEntity.ok().build();
    }

    // 학원 관련 스케줄 출력
    @GetMapping("/public/{academyId}/schedule")
    public ResponseEntity<List<ScheduleResponse>> getAllSchedule(@PathVariable int academyId) {
        List<ScheduleResponse> schedules = scheduleService.getAllSchedulesByAcademyId(academyId);
        return ResponseEntity.ok(schedules);
    }
}
