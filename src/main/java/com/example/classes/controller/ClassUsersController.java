package com.example.classes.controller;

import com.example.classes.service.ClassUsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class ClassUsersController {
    private final ClassUsersService classUsersService;

    // 학생 클래스에 등록
    @PostMapping("/th/{classId}/register")
    public ResponseEntity<?> registerStudents(@PathVariable int classId,
                                              @RequestBody List<Integer> studentIds) {
        classUsersService.registerStudentToClass(classId, studentIds);
        return ResponseEntity.ok().build();
    }

    // 학생 목록 제거 - 복수
    @DeleteMapping("/th/{classId}/unregister")
    public ResponseEntity<?> removeClassUsers(@PathVariable int classId,
                                              @RequestBody List<Integer> studentIds) {
        classUsersService.removeStudentsFromClass(classId, studentIds);
        return ResponseEntity.ok().build();
    }

    // 단일 제거
    @DeleteMapping("/public/{classId}/unregister/{studentId}")
    public ResponseEntity<?> removeClassUser(@PathVariable int classId, @PathVariable int studentId) {
        classUsersService.removeStudentFromClass(classId, studentId);
        return ResponseEntity.ok().build();
    }

}
