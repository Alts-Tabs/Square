package com.example.user.controller;

import com.example.user.dto.StudentDto;
import com.example.user.service.StudentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class AcademyController {
    private final StudentsService studentsService;

    @GetMapping("/public/{academyId}/students")
    public ResponseEntity<List<StudentDto>> getStudentsByAcademy(@PathVariable int academyId) {
        List<StudentDto> students = studentsService.getStudentsByAcademy(academyId);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/public/{academyId}/students/search")
    public ResponseEntity<List<StudentDto>> searchStudentsByName(@PathVariable int academyId,
                                                                 @RequestParam("keyword") String keyword) {
        List<StudentDto> students = studentsService.searchStudentByName(academyId, keyword);
        return ResponseEntity.ok(students);
    }

    @DeleteMapping("/th/{userId}/student")
    public ResponseEntity<?> deleteStudentByUserId(@PathVariable int userId) {
        studentsService.deleteStudentByUserId(userId);
        return ResponseEntity.ok().build();
    }
}
