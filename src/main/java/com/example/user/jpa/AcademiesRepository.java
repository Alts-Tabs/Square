package com.example.user.jpa;

import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AcademiesRepository extends JpaRepository<AcademiesEntity, Integer> {
    // 학원 고유 코드로 조회 - 코드 중복체크 용
    Optional<AcademiesEntity> findByCode(String code);

    // UsersEntity 기반으로 조회 - 원장이 소유한 학원
    AcademiesEntity findByUser(UsersEntity user);

    // 존재하는 접두사 출력
    @Query("SELECT a.aca_prefix FROM AcademiesEntity a WHERE a.aca_prefix LIKE CONCAT(:basePrefix, '%')")
    List<String> findAllByPrefix(@Param("basePrefix") String basePrefix);
}
