package com.example.timetable.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TimetableResponseDto {
    //timetable 테이블 요소
    private int timetableId;
    private String title;
    private int daySort;
    private LocalDate startDate;
    private LocalDate endDate;

    //timecontents 테이블
    private List<TimecontentsDto> contents;

    //timeusers 테이블
    private List<TimeusersDto> users;

    //요일명 리스트
    private List<String> dayList;


}
