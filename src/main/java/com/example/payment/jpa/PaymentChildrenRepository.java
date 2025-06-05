package com.example.payment.jpa;

import com.example.user.entity.StudentsEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentChildrenRepository extends JpaRepository<StudentsEntity, Integer> {
    //수업을 장바구니에 넣어두기 전에 학부모 로그인 후 자녀를 선택하는 GET
    @Transactional
    @Query("select s from StudentsEntity s where s.parent.id = :parentId")
    List<StudentsEntity> getChildrenByParentId(@Param("parentId") int parentId);
}
