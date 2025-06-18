package com.example.attend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentSummaryDto {
    private int studentId;
    private String name;
    private int count;
}
