package com.example.attend.repository;

import com.example.attend.entity.AttendancesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendancesRepository extends JpaRepository<AttendancesEntity, Integer> {
    List<AttendancesEntity> findByTimetableAttend_Idx(int idx);
    AttendancesEntity findByIdxAndStudent_StudentId(int idx, int studentId);
}
