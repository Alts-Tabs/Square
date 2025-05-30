package com.example.schedule.dto;

import com.example.schedule.entity.ScheduleType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ScheduleResponse {
    private int scheduleId;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String color;
    private ScheduleType type;

    // 학사일정 만 값 존재
    private Integer schoolId;
    private String schoolName;
}
