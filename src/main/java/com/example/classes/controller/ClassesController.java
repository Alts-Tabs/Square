package com.example.classes.controller;

import com.example.classes.dto.ClassCreateRequestDto;
import com.example.classes.dto.ClassResponse;
import com.example.classes.entity.ClassesEntity;
import com.example.classes.jpa.ClassCountProjection;
import com.example.classes.jpa.ClassUsersRepository;
import com.example.classes.jpa.ClassesRepository;
import com.example.classes.service.ClassesService;
import com.example.user.dto.StudentDto;
import com.example.user.dto.TeacherDto;
import com.example.user.entity.TeachersEntity;
import com.example.user.jpa.TeachersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class ClassesController {
    private final TeachersRepository teachersRepository;
    private final ClassesRepository classesRepository;
    private final ClassUsersRepository classUsersRepository;
    private final ClassesService classesService;

    // 학원 내 모든 선생 리스트 가져오기 - 원장만 가능
    @GetMapping("/dir/{academyId}/teachers")
    public List<TeacherDto> getTeachersByAcademy(@PathVariable int academyId) {
        return teachersRepository.findByAcademyId(academyId).stream()
                .map(TeacherDto :: fromEntity)
                .collect(Collectors.toList());
    }

    // 클래스 등록 - 클래스명(name), 정원(capacity), 담당자(teacherId)
    @PostMapping("/dir/createClass")
    public ResponseEntity<ClassResponse> createClass(@RequestBody ClassCreateRequestDto dto) {
        // teacherId로 강사 조회
        TeachersEntity teacher = teachersRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("해당 선생님이 존재하지 않습니다."));

        // 클래스 생성 & 저장
        ClassesEntity newClass = ClassesEntity.builder()
                .name(dto.getName())
                .capacity(dto.getCapacity() != null ? dto.getCapacity() : 30)
                .teacher(teacher)
                .academy(teacher.getAcademy()) // 양방향 설정으로 자동 속한 학원 뽑아짐
                .build();

        ClassesEntity saved = classesRepository.save(newClass);

        // DTO로 변환
        ClassResponse response = ClassResponse.builder()
                .id(saved.getClassId())
                .name(saved.getName()) // 학원명
                .capacity(saved.getCapacity())
                .teacherId(teacher.getTeacherId())
                .teacherName(teacher.getUser().getName()) // 강사명
                .build();

        URI location = URI.create("/createClass/" + saved.getClassId()); // 생성된 자원 명확히하기
        return ResponseEntity.created(location).body(response);
    }

    // 학원 내 모든 클래스 정보 불러오기
    @GetMapping("/th/{academyId}/classes")
    public ResponseEntity<List<ClassResponse>> getClassesByAcademy(@PathVariable int academyId) {
        List<ClassesEntity> classes = classesRepository.findByAcademyId(academyId);

        Map<Integer, Long> classIdToCount = classUsersRepository
                .countStudentsByAcademy(academyId).stream().collect(Collectors.toMap(
                        ClassCountProjection::getClassId,
                        ClassCountProjection::getCount
                ));

        List<ClassResponse> response = classes.stream()
                .map(c -> ClassResponse.builder()
                        .id(c.getClassId())
                        .name(c.getName())
                        .currentCount(classIdToCount.getOrDefault(c.getClassId(), 0L).intValue())
                        .capacity(c.getCapacity())
                        .teacherId(c.getTeacher().getTeacherId())
                        .teacherName(c.getTeacher().getUser().getName())
                        .tuition(c.getTuition() != null ? c.getTuition() : 0)
                        .build()).toList();
        return ResponseEntity.ok(response);
    }

    // 학원 내 클래스 삭제
    @DeleteMapping("/dir/{classId}/delete")
    public ResponseEntity<?> deleteClassesByClassId(@PathVariable int classId) {
        if(!classesRepository.existsById(classId)) {
            return ResponseEntity.notFound().build();
        }

        classesRepository.deleteById(classId);
        return ResponseEntity.ok().build();
    }

    /** userId로 student 이름 조회 - 종합평가 등록 페이지에서 사용*/
    @GetMapping("/dir/{classId}/students")
    public ResponseEntity<List<StudentDto>> getStudentsByClass(@PathVariable int classId) {
        List<StudentDto> students = classesService.getStudentsByClassId(classId);
        return ResponseEntity.ok(students);
    }

}
