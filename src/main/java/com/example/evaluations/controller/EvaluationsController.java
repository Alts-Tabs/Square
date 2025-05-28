package com.example.evaluations.controller;

import com.example.evaluations.entity.EvaluationsDto;
import com.example.evaluations.jpa.EvaluationsService;
import com.example.user.dto.TeacherDto;
import com.example.user.service.TeachersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin
public class EvaluationsController {
    private final EvaluationsService evaluationsService;
    private final TeachersService teachersService;

    //종합평가 등록
    @PostMapping("/th/insertEvaluation")
    public ResponseEntity<String> insertEvaluation(@RequestBody EvaluationsDto dto,
                                                   @RequestParam String period){
        log.info("insertEvaluation called with teacherId: {}", dto.getTeacherId());
        evaluationsService.insertEvaluation(dto,period);
        return ResponseEntity.ok("평가 등록 완료");
    }

    //로그인한 선생님 계정의 저장된 subject 조회
    @GetMapping("/teachers/subjects")
    public ResponseEntity<List<TeacherDto>> getSubjectsByRole(@RequestParam String role, @RequestParam int userId) {
        List<TeacherDto> subjects = teachersService.getSubjectsByRole(role, userId);
        return ResponseEntity.ok(subjects);
    }

}
