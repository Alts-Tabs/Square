package com.example.user.controller;

import com.example.user.dto.StudentDto;
import com.example.user.dto.TeacherListDto;
import com.example.user.service.StudentsService;
import com.example.user.service.TeachersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class AcademyController {
    private final StudentsService studentsService;
    private final TeachersService teachersService;

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

    @GetMapping("/dir/{academyId}/teacherList")
    public ResponseEntity<List<TeacherListDto>> getTeacherListByAcademyId(@PathVariable int academyId) {
        List<TeacherListDto> teachers = teachersService.getTeacherListByAcademyId(academyId);
        return ResponseEntity.ok(teachers);
    }

    @DeleteMapping("/dir/{teacherId}/teacher")
    public ResponseEntity<?> deleteTeacherByTeacherId(@PathVariable int teacherId) {
        teachersService.deleteTeacherByTeacherId(teacherId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/th/{userId}/student")
    public ResponseEntity<?> deleteStudentByUserId(@PathVariable int userId) {
        studentsService.deleteStudentByUserId(userId);
        return ResponseEntity.ok().build();
    }
}
