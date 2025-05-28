package com.example.payment.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentGetClassDto {
    private int id;
    private String name; //과목명
    private int tuition; //수업료
    private String teacherName; //강사명 => 표시값
    private int teacherId; //강사 id 고유값
}
