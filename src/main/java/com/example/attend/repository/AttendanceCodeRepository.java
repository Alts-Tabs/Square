package com.example.attend.repository;

import com.example.attend.entity.AttendanceCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceCodeRepository extends JpaRepository<AttendanceCodeEntity, Integer> {
    // 최신 코드 하나만 조회 (created_at 기준 내림차순)
    AttendanceCodeEntity findTopByTimetableAttend_IdxOrderByCreatedAtDesc(int idx);
}
