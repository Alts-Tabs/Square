package com.example.schedule.jpa;

import com.example.schedule.entity.ScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<ScheduleEntity, Integer> {
    List<ScheduleEntity> findByAcademy_AcademyId(int academyId); // 해당 학원 모든 스케줄 조회
}
