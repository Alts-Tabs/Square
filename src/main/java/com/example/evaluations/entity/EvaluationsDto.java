package com.example.evaluations.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvaluationsDto {
    private int teacherId;
    private int studentId;
    private String startDate;
    private String endDate;
    private String contents;
    //private String period;
    private String subject;
    private int score;
    private String teacherName;
    private String created_at;
}
