package com.example.schedule.dto;

import com.example.schedule.entity.ScheduleType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScheduleUpdateRequest {
    private String title;
    private String description;
    private ScheduleType type;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer schoolsId; // ACADEMIC 일 경우 학교 id (nullable)
}
