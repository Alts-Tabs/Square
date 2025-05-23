package com.example.repository;

import com.example.data.AcademiesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AcademiesRepository extends JpaRepository<AcademiesEntity, Integer> {
    Optional<AcademiesEntity> findByCode(String code); // 코드 중복 체크
    AcademiesEntity findByUsername(String username); // 계정에 맞는 학원 찾기

    // 존재하는 접두사 출력
    @Query("SELECT a.aca_prefix FROM AcademiesEntity a WHERE a.aca_prefix LIKE CONCAT(:basePrefix, '%')")
    List<String> findAllByPrefix(@Param("basePrefix") String basePrefix);
}
