package com.example.timetable.repository;

import com.example.timetable.entity.TimeusersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimeusersRepository extends JpaRepository<TimeusersEntity,Integer> {
    List<TimeusersEntity> findByTimetable_timetableId(int timetableId);
}
