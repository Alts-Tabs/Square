package com.example.timetable.repository;

import com.example.timetable.dto.TimecontentsDto;
import com.example.timetable.entity.TimecontentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimecontentsRepository extends JpaRepository<TimecontentsEntity, Integer> {

    /**timetableId 기준으로 조회*/
    List<TimecontentsEntity> findByTimetable_TimetableId(int timetableId);
}
