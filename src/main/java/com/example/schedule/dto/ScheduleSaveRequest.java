package com.example.schedule.dto;

import com.example.schedule.entity.ScheduleType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScheduleSaveRequest {
    private int academyId;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private ScheduleType type;
    private String color;

    // 학사 일정일 경우만 필요
    private Integer schoolId;

}
