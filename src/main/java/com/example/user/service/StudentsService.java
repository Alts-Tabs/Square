package com.example.user.service;

import com.example.user.dto.StudentDto;
import com.example.user.entity.StudentsEntity;
import com.example.user.jpa.StudentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentsService {
    private final StudentsRepository studentsRepository;

    /**
     * 학원 내 학생 목록 가져오기
     * @param academyId int
     * @param pageable Pageable
     * @return page Page<StudentDto>
     */
    public Page<StudentDto> getStudentsByAcademy(int academyId, Pageable pageable) {
        Page<StudentsEntity> page = studentsRepository.findAllByAcademy_AcademyId(academyId, pageable);

        return page.map(s -> new StudentDto(
                s.getStudentId(), s.getUser().getUsername(),
                s.getUser().getName(), s.getUser().getPhone(),
                s.getGrade(), s.getRoom()
        ));
    }

    /**
     * 학원 내 keyword 포함한 학생 반환
     * @param academyId int
     * @param keyword String
     * @return List<StudentDto>
     */
    public List<StudentDto> searchStudentByName(int academyId, String keyword) {
        List<StudentsEntity> entities = studentsRepository.findByAcademy_AcademyIdAndUser_NameContaining(academyId, keyword);

        return entities.stream().map(s -> new StudentDto(
                s.getStudentId(), s.getUser().getUsername(), s.getUser().getName(),
                s.getUser().getPhone(), s.getGrade(), s.getRoom()
        )).toList();
    }
}
