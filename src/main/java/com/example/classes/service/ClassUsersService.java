package com.example.classes.service;

import com.example.classes.dto.RegisterResultDto;
import com.example.classes.entity.ClassUsersEntity;
import com.example.classes.entity.ClassesEntity;
import com.example.classes.jpa.ClassUsersRepository;
import com.example.classes.jpa.ClassesRepository;
import com.example.user.dto.StudentDto;
import com.example.user.entity.StudentsEntity;
import com.example.user.jpa.StudentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassUsersService {
    private final ClassesRepository classesRepository;
    private final StudentsRepository studentsRepository;
    private final ClassUsersRepository classUsersRepository;

    /**
     * 학생 계정 클래스에 등록하는 로직
     * @param classId int
     * @param studentIds List<Integer>
     * @return result RegisterResultDto
     */
    @Transactional
    public RegisterResultDto registerStudentToClass(int classId, List<Integer> studentIds) {
        ClassesEntity classEntity = classesRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Class Not Found"));

        int currentEnrollment = classEntity.getClassUsers().size(); // 현재 등록 인원 수
        int availableSpots = classEntity.getCapacity() - currentEnrollment; // 남은 정원 수

        RegisterResultDto result = new RegisterResultDto();

        // 정원 초과
        if(studentIds.size() > availableSpots) {
            result.addError(null, "capacity", "정원 초과, 남은 자리: " + availableSpots);
            return result;
        }

        List<StudentsEntity> students = studentsRepository.findAllById(studentIds);

        Set<Integer> foundStudentIds = students.stream()
                .map(StudentsEntity :: getStudentId)
                .collect(Collectors.toSet());

        // 존재하지 않은 ID
        for(Integer id : foundStudentIds) {
            if(!foundStudentIds.contains(id)) {
                result.addError(id, "Invalid ID", "해당 ID의 학생이 존재하지 않습니다.");
            }
        }

        List<ClassUsersEntity> newEnrollments = new ArrayList<>(); // 새로 등록할 학생 목록

        for(StudentsEntity student : students) {
            int studentId = student.getStudentId();
            String name = student.getUser().getName();

            // 학원 불일치
            if(classEntity.getAcademy().getAcademyId() != student.getAcademy().getAcademyId()) {
                result.addError(studentId, "wrong_academy", "학생 [" +name+"]은 다른 학원 소속입니다.");
                continue;
            }

            // 중복 검사 - 이미 등록
            boolean alreadyEnrolled = classUsersRepository.existsByClassEntityAndStudent(classEntity, student);

            if(alreadyEnrolled) {
                result.addError(studentId, "Already_Class", "학생 [" +name+"]은 이미 클래스에 속했습니다.");
                continue;
            }

            // 등록 정보 생성
            ClassUsersEntity enrollment = ClassUsersEntity.builder()
                    .classEntity(classEntity)
                    .student(student)
                    .build();

            newEnrollments.add(enrollment);
        }

        // 저장
        if(result.getErrors().isEmpty()) {
            classUsersRepository.saveAll(newEnrollments);
            // 양방향 관계 반영
            classEntity.getClassUsers().addAll(newEnrollments);
            for(ClassUsersEntity cu : newEnrollments) {
                cu.getStudent().getClassUsers().add(cu);
            }
        }
        return result;
    }

    /**
     * 클래스 학생 목록에서 학생 제거 - 여러명
     * @param classId int
     * @param studentIds List<Integer>
     */
    @Transactional
    public void removeStudentsFromClass(int classId, List<Integer> studentIds) {
        ClassesEntity classEntity = classesRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Class Not Found"));

        List<ClassUsersEntity> enrollments = classEntity.getClassUsers(); // 현재 속한 인원

        // 삭제 명부
        List<ClassUsersEntity> toRemove = new ArrayList<>(
                enrollments.stream()
                        .filter(cu -> studentIds.contains(cu.getStudent().getStudentId()))
                        .toList()
        );

        if(toRemove.isEmpty()) {
            throw new IllegalArgumentException("제거 대상이 클래스에 없습니다");
        }

        // 양방향 관계 정리
        for(ClassUsersEntity cu : toRemove) {
            classEntity.getClassUsers().remove(cu);
            cu.getStudent().getClassUsers().remove(cu);
        }

        // 삭제
        classUsersRepository.deleteAll(toRemove);
    }

    /**
     * 클래스 학생 목록에서 제거 - 단일
     * @param classId int
     * @param studentId int
     */
    @Transactional
    public void removeStudentFromClass(int classId, int studentId) {
        ClassesEntity classEntity = classesRepository.findById(classId).orElse(null);
        StudentsEntity student = studentsRepository.findById(studentId).orElse(null);

        if(classEntity == null || student == null) {
            return;
        }

        Optional<ClassUsersEntity> classUserOpt = classUsersRepository
                .findByClassEntityAndStudent(classEntity, student);

        // 존재하지 않으면 무시
        if(classUserOpt.isEmpty()) {
            return;
        }

        ClassUsersEntity classUser = classUserOpt.get();
        classEntity.getClassUsers().remove(classUser);
        student.getClassUsers().remove(classUser);
        classUsersRepository.delete(classUser);
    }

}
