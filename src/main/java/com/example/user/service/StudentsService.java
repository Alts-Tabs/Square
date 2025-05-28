package com.example.user.service;

import com.example.user.dto.StudentDto;
import com.example.user.entity.StudentsEntity;
import com.example.user.jpa.StudentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentsService {
    private final StudentsRepository studentsRepository;

    /**
     * 학원 내 학생 목록 가져오기
     * @param academyId int
     * @return students List<StudentDto>
     */
    public List<StudentDto> getStudentsByAcademy(int academyId) {
        List<StudentsEntity> students = studentsRepository.findAllByAcademy_AcademyId(academyId);

        return students.stream().map(s -> {
            var user = s.getUser();
            var parent = s.getParent();
            var school = s.getSchool();

            String regDate = user.getCreated_at().toLocalDateTime()
                    .format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

            String formattedPhone = formatPhone(user.getPhone());
            String formattedParentPhone = parent != null ? formatPhone(parent.getUser().getPhone()) : null;

            String schoolName = school != null ? school.getName() : null;

            List<String> classNames = s.getClassUsers().stream()
                    .map(cu -> cu.getClassEntity().getName()).toList();
            List<Integer> classIds = s.getClassUsers().stream()
                    .map(cu -> cu.getClassEntity().getClassId()).toList();

            return StudentDto.builder()
                    .studentId(s.getStudentId())
                    .username(user.getUsername())
                    .name(user.getName())
                    .phone(formattedPhone)
                    .grade(s.getGrade())
                    .room(s.getRoom())
                    .regDate(regDate)
                    .parentPhone(formattedParentPhone)
                    .classNames(classNames)
                    .classIds(classIds)
                    .schoolName(schoolName)
                    .build();
        }).toList();
    }

    /**
     * 학원 내 keyword 포함한 학생 반환
     * @param academyId int
     * @param keyword String
     * @return List<StudentDto>
     */
    public List<StudentDto> searchStudentByName(int academyId, String keyword) {
        List<StudentsEntity> entities = studentsRepository.findByAcademy_AcademyIdAndUser_NameContaining(academyId, keyword);

        return entities.stream().map(s -> {
            var user = s.getUser();
            var parent = s.getParent();
            var school = s.getSchool();

            String regDate = user.getCreated_at().toLocalDateTime()
                    .format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

            String formattedPhone = formatPhone(user.getPhone());
            String formattedParentPhone = parent != null ? formatPhone(parent.getUser().getPhone()) : null;

            String schoolName = school != null ? school.getName() : null;

            List<String> classNames = s.getClassUsers().stream()
                    .map(cu -> cu.getClassEntity().getName())
                    .toList();
            List<Integer> classIds = s.getClassUsers().stream()
                    .map(cu -> cu.getClassEntity().getClassId())
                    .toList();

            return StudentDto.builder()
                    .studentId(s.getStudentId())
                    .username(user.getUsername())
                    .name(user.getName())
                    .phone(formattedPhone)
                    .grade(s.getGrade())
                    .room(s.getRoom())
                    .regDate(regDate)
                    .classNames(classNames)
                    .classIds(classIds)
                    .parentPhone(formattedParentPhone)
                    .schoolName(schoolName)
                    .build();
        }).toList();
    }

    // 핸드폰 번호 포맷 함수
    private String formatPhone(String phone) {
        if(phone == null || phone.length() != 11)
            return phone;
        return phone.replaceAll("(\\d{3})(\\d{4})(\\d{4})", "$1-$2-$3");
    }
}
