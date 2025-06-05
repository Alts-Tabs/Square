package com.example.timetable.repository;

import com.example.timetable.entity.TimetableEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimetableRepository extends JpaRepository<TimetableEntity, Integer> {
}
