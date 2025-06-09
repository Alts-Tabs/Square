package com.example.payment.jpa;

import com.example.classes.entity.ClassesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface PaymentGetClassRepository extends JpaRepository<ClassesEntity, Integer> {
    //ClassesRepository 와 유사하나 수업료가 추가되어야 함
    //네이티브 SQL 과는 다른 Spring Data JPA 문법으로 작성했습니다!
    //콜론은 꼭 뒷부분과 붙여서 쓸 것! 자세한 건 JPQL 문법을 참조하세요!
    @Modifying
    @Transactional
    @Query("update ClassesEntity c SET c.tuition = :tuition where c.classId = :classId")
    int updateTuitionByClassId(@Param("classId") int classId, @Param("tuition") int tuition);
}
