package com.example.timetable.repository;

import com.example.timetable.entity.TimetableEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableRepository extends JpaRepository<TimetableEntity, Integer> {
    List<TimetableEntity> findByAcademy_AcademyId(int academyId);
}
