package com.example.attend.repository;

import com.example.attend.entity.TimetableAttendEntity;
import com.example.timetable.entity.TimetableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimetableAttendRepository extends JpaRepository<TimetableAttendEntity, Integer> {
    Optional<TimetableAttendEntity> findTopByTimetableOrderByIdxDesc(TimetableEntity timetable);
    List<TimetableAttendEntity> findByTimetable_TimetableId(int timetableId);
}