package com.example.payment.jpa;

import com.example.payment.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentGetClassRepository extends JpaRepository<PaymentEntity, Integer> {
    //ClassesRepository와 유사하나 수업료가 추가되어야 함
    @Query("select tuition from ClassesEntity c where c.academy.academy_id = :academyId")
    List<PaymentEntity> findByAcademyId(@Param("academyId") Integer academyId);
    }
