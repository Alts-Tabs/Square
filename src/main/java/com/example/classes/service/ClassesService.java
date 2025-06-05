package com.example.classes.service;

import com.example.classes.jpa.ClassUsersRepository;
import com.example.classes.jpa.ClassesRepository;
import com.example.user.dto.StudentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassesService {
    private final ClassUsersRepository classUsersRepository;

    public List<StudentDto> getStudentsByClassId(int classId) {
        return classUsersRepository.findStudentDtoByClassId(classId);
    }
}
