package com.example.timetable.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetableRequestDto {

    private int academyId;
    private String title;
    private int daySort;
    private LocalDate startDate;
    private LocalDate endDate;

    private List<TimecontentsDto> contentsDtoList;

}
