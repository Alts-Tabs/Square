package com.example.attend.repository;

import com.example.attend.entity.AttendanceCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceCodeRepository extends JpaRepository<AttendanceCodeEntity, Integer> {
    AttendanceCodeEntity findByIdx(int idx);
    void deleteByIdx(int idx);
}
