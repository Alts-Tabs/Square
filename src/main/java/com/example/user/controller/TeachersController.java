package com.example.user.controller;

import com.example.user.dto.TeacherDto;
import com.example.user.service.TeachersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class TeachersController {
    private final TeachersService teachersService;

    //로그인한 선생님 계정의 저장된 subject 조회 - 종합평가 페이지에서 사용
    @GetMapping("/public/teacher/subjects")
    public ResponseEntity<List<TeacherDto>> getSubjectsByRole(@RequestParam String role, @RequestParam int userId) {
        List<TeacherDto> subjects = teachersService.getSubjectsByRole(role, userId);
        return ResponseEntity.ok(subjects);
    }
    // userId로 teacherId 조회 - 종합평가 페이지에서 사용
    @GetMapping("/public/teacher/getTeacherId")
    public ResponseEntity<Integer> getTeacherId(@RequestParam int userId) {
        int teacherId = teachersService.getTeacherIdByUserId(userId);
        return ResponseEntity.ok(teacherId);
    }
}
