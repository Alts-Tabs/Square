package com.example.timetable.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetableDto {
    public int timetableId;
    public String title;
    public int daySort;
    private LocalDate startDate;
    private LocalDate endDate;
}
