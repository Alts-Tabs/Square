package com.example.data;

import lombok.Data;

@Data
public class EvaluationsDto {
    private int teacherId;
    private int studentId;
    private String startDate;
    private String endDate;
    private String contents;
    //private String period;
    private String subject;
    private int score;
}
