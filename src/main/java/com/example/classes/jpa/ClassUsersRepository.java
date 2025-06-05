package com.example.classes.jpa;

import com.example.classes.entity.ClassUsersEntity;
import com.example.classes.entity.ClassesEntity;
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
}
