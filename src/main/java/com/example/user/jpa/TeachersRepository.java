package com.example.user.jpa;

import com.example.user.entity.TeachersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TeachersRepository extends JpaRepository<TeachersEntity, Integer> {
    // academy_id로 선생 목록 조회
    @Query("SELECT t FROM TeachersEntity t WHERE t.academy.academy_id = :academyId")
    List<TeachersEntity> findByAcademyId(@Param("academyId") int academyId);
}
