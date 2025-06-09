package com.example.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder

//수강신청 입력에 필요한 데이터
public class PaymentEnrollDto {
    private int enrollId;
    private int parentId;
    private int studentId;
    private int classId;
    private String duration;
}