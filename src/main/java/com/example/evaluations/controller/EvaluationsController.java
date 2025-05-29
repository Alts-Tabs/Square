package com.example.evaluations.controller;

import com.example.evaluations.entity.EvaluationsDto;
import com.example.evaluations.entity.EvaluationsEntity;
import com.example.evaluations.jpa.EvaluationsRepository;
import com.example.evaluations.jpa.EvaluationsService;
import com.example.user.dto.TeacherDto;
import com.example.user.service.StudentsService;
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
    private final StudentsService studentsService;
    private final EvaluationsRepository evaluationsRepository;

    //종합평가 등록
    @PostMapping("/th/insertEvaluation")
    public ResponseEntity<String> insertEvaluation(@RequestBody EvaluationsDto dto,
                                                   @RequestParam String period){
        //log.info("insertEvaluation called with teacherId: {}", dto.getTeacherId());
        evaluationsService.insertEvaluation(dto,period);
        return ResponseEntity.ok("평가 등록 완료");
    }

    @GetMapping("/student/evalStuSubject")
    public ResponseEntity<List<TeacherDto>> getSubjectsByStudent(@RequestParam String userId){
        //userId로 studentId 찾기
        int studentId = studentsService.getStudentIdByUserId(Integer.parseInt(userId));

        //studentId로 subject + teacher 정보 조회
        List<TeacherDto> subjects=evaluationsRepository.findDistinctSubjectTeacherByStudentId(studentId);

        return ResponseEntity.ok(subjects);
    }

    //evaluationStudet 페이지 진입 시 전체 목록 노출
    @GetMapping("/student/evalStuList")
    public ResponseEntity<List<EvaluationsDto>> getStudentEvaluations(
            @RequestParam(name = "userId") int userId) {

        List<EvaluationsDto> result = evaluationsService.getStudentEvaluations(userId);
        return ResponseEntity.ok(result);
    }

    //입력된 조건에 맞게 검색
    @GetMapping("/student/evalStuSearch")
    public ResponseEntity<List<EvaluationsDto>> searchStudentEvaluations(
            @RequestParam(name = "userId") int userId,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        List<EvaluationsDto> result = evaluationsService.searchStudentEvaluations(userId, subject, period, startDate, endDate);
        return ResponseEntity.ok(result);
    }



}
