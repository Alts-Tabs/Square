package com.example.user.controller;

import com.example.user.dto.StudentDto;
import com.example.user.service.StudentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class AcademyController {
    private final StudentsService studentsService;

    @GetMapping("/public/{academyId}/students")
    public ResponseEntity<Page<StudentDto>> getStudentsByAcademy(@PathVariable int academyId,
                                                                 @PageableDefault(size = 20, sort = "studentId", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<StudentDto> students = studentsService.getStudentsByAcademy(academyId, pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/public/{academyId}/students/search")
    public ResponseEntity<List<StudentDto>> searchStudentsByName(@PathVariable int academyId,
                                                                 @RequestParam("keyword") String keyword) {
        List<StudentDto> students = studentsService.searchStudentByName(academyId, keyword);
        return ResponseEntity.ok(students);
    }
}
