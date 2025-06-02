package com.example.schedule.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScheduleDateUpdateRequest {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
