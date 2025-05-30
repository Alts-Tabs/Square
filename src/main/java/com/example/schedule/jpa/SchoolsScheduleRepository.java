package com.example.schedule.jpa;

import com.example.schedule.entity.ScheduleEntity;
import com.example.schedule.entity.SchoolsEntity;
import com.example.schedule.entity.SchoolsScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SchoolsScheduleRepository extends JpaRepository<SchoolsScheduleEntity, Integer> {
    // 특정 학원에 스케줄이 등록된 학원 리스트만 뽑기
    @Query("""
            SELECT DISTINCT ss.school FROM SchoolsScheduleEntity ss
            JOIN ss.schedule s
            WHERE s.academy.academyId = :academyId
            """)
    List<SchoolsEntity> findDistinctSchoolsByAcademyId(@Param("academyId") int academyId);

    Optional<SchoolsScheduleEntity> findBySchedule(ScheduleEntity schedule); // 학사일정 관련 매핑 조회
}
