package com.example.repository;

import com.example.data.AcademiesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AcademiesRepository extends JpaRepository<AcademiesEntity, Integer> {
    Optional<AcademiesEntity> findByCode(String code); // 코드 중복 체크
}
