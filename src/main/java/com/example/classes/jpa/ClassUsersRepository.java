package com.example.classes.jpa;

import com.example.classes.entity.ClassUsersEntity;
import com.example.classes.entity.ClassesEntity;
import com.example.user.entity.StudentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassUsersRepository extends JpaRepository<ClassUsersEntity, Integer> {
    boolean existsByClassEntityAndStudent(ClassesEntity classEntity, StudentsEntity student); // 중복 검사
    Optional<ClassUsersEntity> findByClassEntityAndStudent(ClassesEntity classesEntity, StudentsEntity student);
}
