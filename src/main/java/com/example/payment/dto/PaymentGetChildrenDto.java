package com.example.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class PaymentGetChildrenDto {
    //StudentsEntity 에서 학부모의 수강신청 기능 중 자녀 이름을 선택하기 위해서 만든 Dto
    //Entity 파일을 그대로 받아오게 되면 Could not write JSON: Infinite recursion
    //가 발생하기 때문에 꼭 Dto 로 추출하여 컨트롤러 중
    // "/parent/{roleId}/students" 경로에 new 를 이용하여 접근하기 위해 만든 dto
    //name을 가져올 것
    private int studentId;
    private String name;
}
