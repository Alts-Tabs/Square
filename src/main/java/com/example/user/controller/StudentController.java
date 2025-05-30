package com.example.user.controller;

import com.example.user.dto.StudentDto;
import com.example.user.service.StudentsService;
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
public class StudentController {
    private final StudentsService studentsService;

    /**전체 학생 조회 추후 수정할 예정*/
    @GetMapping("/studentList")
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        List<StudentDto> students = studentsService.getAllStudentsWithNames();
        return ResponseEntity.ok(students);
    }

    /** parentId에 대한 학생 목록 조회*/
    @GetMapping("/parent/students")
    public ResponseEntity<List<StudentDto>> getStudentsByParentId(@RequestParam int parentId) {
        List<StudentDto> students =studentsService.getStudentsByParentId(parentId);
        return ResponseEntity.ok(students);
    }
    

}
