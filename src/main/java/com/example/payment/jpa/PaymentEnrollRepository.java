package com.example.payment.jpa;

import com.example.payment.entity.EnrollEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentEnrollRepository extends JpaRepository<EnrollEntity, Integer> {
    //수업을 수강신청까지 하고 신청하기 이벤트 이후 우측 하단에 각 학부모가 받아오는 get
    @Transactional
    @Query("select e from EnrollEntity e where e.parent.parentId = :parentId")
    List<EnrollEntity> getEnrollByParentId(@Param("parentId") int parentId);
}
