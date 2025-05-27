package com.example.classes.service;

import com.example.classes.entity.ClassUsersEntity;
import com.example.classes.entity.ClassesEntity;
import com.example.classes.jpa.ClassUsersRepository;
import com.example.classes.jpa.ClassesRepository;
import com.example.user.entity.StudentsEntity;
import com.example.user.jpa.StudentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
     */
    @Transactional
    public void registerStudentToClass(int classId, List<Integer> studentIds) {
        ClassesEntity classEntity = classesRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Class Not Found"));

        int currentEnrollment = classEntity.getClassUsers().size(); // 현재 등록 인원 수
        int availableSpots = classEntity.getCapacity() - currentEnrollment; // 남은 정원 수

        if(studentIds.size() > availableSpots) {
            throw new IllegalStateException("정원 초과, 남은 자리: " + availableSpots);
        }

        List<StudentsEntity> students = studentsRepository.findAllById(studentIds);

        if(students.size() != studentIds.size()) {
            throw new IllegalArgumentException("일치하지 않은 학생 ID 존재");
        }

        List<ClassUsersEntity> newEnrollments = new ArrayList<>(); // 새로 등록할 학생 목록

        for(StudentsEntity student : students) {
            // 학원 일치 검사
            if(classEntity.getAcademy().getAcademyId() != student.getAcademy().getAcademyId()) {
                throw new IllegalArgumentException("학생 [" +student.getUser().getName()+"]은 다른 학원 소속입니다.");
            }

            // 중복 검사
            boolean alreadyEnrolled = classUsersRepository.existsByClassEntityAndStudent(classEntity, student);

            if(alreadyEnrolled) {
                throw new IllegalStateException("학생 [" +student.getUser().getName()+"]은 이미 클래스에 속했습니다.");
            }

            // 등록 정보 생성
            ClassUsersEntity enrollment = ClassUsersEntity.builder()
                    .classEntity(classEntity)
                    .student(student)
                    .build();

            newEnrollments.add(enrollment);
        }

        // 저장
        classUsersRepository.saveAll(newEnrollments);

        // 양방향 관계 반영
        classEntity.getClassUsers().addAll(newEnrollments);
        for(ClassUsersEntity cu : newEnrollments) {
            cu.getStudent().getClassUsers().add(cu);
        }
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
