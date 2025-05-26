package com.example.classes.jpa;

import com.example.classes.entity.ClassesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClassesRepository extends JpaRepository<ClassesEntity, Integer> {
    // 학원 아이디로 클래스 리스트 조회
    @Query("SELECT c FROM ClassesEntity c WHERE c.academy.academy_id = :academyId")
    List<ClassesEntity> findByAcademyId(@Param("academyId") int academyId);
}
