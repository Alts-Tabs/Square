package com.example.timetable.controller;

import com.example.timetable.dto.TimetableRequestDto;
import com.example.timetable.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService timetableService;

    @PostMapping("/dir/saveTimetable")
    public ResponseEntity<String> saveTimetable(@RequestBody TimetableRequestDto dto){
        timetableService.saveTimetable(dto);
        return ResponseEntity.ok("시간표가 저장되었습니다.");
    }


}
