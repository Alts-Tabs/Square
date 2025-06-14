package com.example.attend.repository;

import com.example.attend.entity.TimetableAttendEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimetableAttendRepository extends JpaRepository<TimetableAttendEntity, Integer> {
    TimetableAttendEntity findByAttendanceCode_Idx(int codeIdx);
}
