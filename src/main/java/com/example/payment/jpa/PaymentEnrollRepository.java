package com.example.payment.jpa;

import com.example.payment.entity.EnrollEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentEnrollRepository extends JpaRepository<EnrollEntity, Integer> {
    //수업을 수강신청까지 하고 신청하기 이벤트 이후 우측 하단에 각 학부모가 받아오는 get
    @Transactional
    @Query("select e from EnrollEntity e where e.parent.parentId = :parentId and e.isPay='F'")
    List<EnrollEntity> getEnrollByParentId(@Param("parentId") int parentId);

    //결제 미납인 장바구니 내역을 학생이 볼 수 있게 할 것
    @Transactional
    @Query("select e from EnrollEntity e where e.student.studentId = :studentId and e.isPay='F'")
    List<EnrollEntity> getEnrollByParentIdForStu(@Param("studentId") int studentId);

    //getEnrollByParentId 에서 원장이 확인 가능한 범위로 수정
    //
    @Transactional
    @Query("select e from EnrollEntity e where e.academyId =:academyId")
    List<EnrollEntity> getAllEnroll(@Param("academyId") int academyId);

    @Modifying
    @Query("UPDATE EnrollEntity e set e.isPay = :isPay WHERE e.enrollId =:enrollId")
    void updateIsPay(@Param("enrollId") Long enrollId, @Param("isPay") String isPay);
    
    //학부모의 기존 결제내역
    @Transactional
    @Query("select e from EnrollEntity e where e.parent.parentId = :parentId and e.isPay='T'")
    List<EnrollEntity> getPrevPayByParentId(@Param("parentId") int parentId);

    //학생이 본인 수업료를 본인 부모가 결제했는지 확인
    @Transactional
    @Query("select e from EnrollEntity e where e.student.studentId = :studentId and e.isPay='T'")
    List<EnrollEntity> getPrevPayByParentIdForStu(@Param("studentId") int studentId);
}
