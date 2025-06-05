package com.example.classes.jpa;

import com.example.classes.entity.ClassUsersEntity;
import com.example.classes.entity.ClassesEntity;
import com.example.user.dto.StudentDto;
import com.example.user.entity.StudentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ClassUsersRepository extends JpaRepository<ClassUsersEntity, Integer> {
    boolean existsByClassEntityAndStudent(ClassesEntity classEntity, StudentsEntity student); // 중복 검사
    Optional<ClassUsersEntity> findByClassEntityAndStudent(ClassesEntity classesEntity, StudentsEntity student);

    /** classId에 해당하는 학생 목록 조회 - 시간표 페이지에서 사용*/
    @Query("SELECT cu.student.studentId FROM ClassUsersEntity cu WHERE cu.classEntity.classId = :classId")
    List<Integer> findStudentIdsByClassId(int classId);

    /** userId로 student 이름 조회 - 종합평가 등록 페이지에서 사용*/
    @Query("SELECT new com.example.user.dto.StudentDto(s.studentId, u.name) " +
            "FROM ClassUsersEntity cu " +
            "JOIN cu.student s " +
            "JOIN s.user u " +
            "WHERE cu.classEntity.classId = :classId")
    List<StudentDto> findStudentDtoByClassId(int classId);
}
