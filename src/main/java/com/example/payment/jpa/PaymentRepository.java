package com.example.payment.jpa;

import com.example.payment.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<PaymentRepository, Integer> {
    //모든 수업을 조회
    //수강료도 조회 가능해야 한다
    //List<PaymentEntity> findByClass(int )
}
