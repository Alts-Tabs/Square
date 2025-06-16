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
    private String isPay; //후반에 추가한 부분; EnrollEntity에서 isPay 받아오기 위해서
}