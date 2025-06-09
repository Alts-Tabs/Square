package com.example.payment.jpa;

import com.example.payment.entity.EnrollEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentEnrollRepository extends JpaRepository<EnrollEntity, Integer> {
}
