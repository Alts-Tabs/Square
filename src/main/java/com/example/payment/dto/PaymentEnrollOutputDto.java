package com.example.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder

/*
수강신청 출력에 필요한 DTO
학부모에게만 필요한 정보
    1. 장바구니의 일련번호
    2. 결제할 학부모의 이름
    3. 자녀 학생의 이름
    4. 클래스 강사 이름
    5. 클래스 이름
    6. 수업 기간
    7. 클래스 수업료

를 통해서 학부가 결제하기 전 확인해야 할 정보를 매핑한다.
*/
public class PaymentEnrollOutputDto {
    private int enrollId;
    private String parentName;
    private String studentName;
    private String teacherName;
    private String className;
    private String duration;
    private int tuition;
}
