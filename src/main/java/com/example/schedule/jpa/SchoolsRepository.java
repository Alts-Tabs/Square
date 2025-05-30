package com.example.schedule.jpa;

import com.example.schedule.entity.SchoolsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchoolsRepository extends JpaRepository<SchoolsEntity, Integer> {
    // 전체 학교 조회
    List<SchoolsEntity> findAll();
}
