package com.example.timetable.repository;

import com.example.timetable.entity.TimecontentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimecontentsRepository extends JpaRepository<TimecontentsEntity, Integer> {
}
