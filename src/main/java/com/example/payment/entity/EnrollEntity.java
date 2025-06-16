package com.example.payment.entity;

import com.example.classes.entity.ClassesEntity;
import com.example.user.entity.ParentsEntity;
import com.example.user.entity.StudentsEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "enroll")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

//학부모가 수업, 자녀를 선택한 후 장바구니에 넣을 때 필요한 db와의 엔터티
public class EnrollEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int enrollId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    private ParentsEntity parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentsEntity student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassesEntity classes;

    @Column(length = 100)
    private String duration;
    
    //이걸 추가해줘야 원장이 수강신청 한 학생의 미납 여부를 관리할 수 있음
    @Column(name = "academy_id", nullable = false)
    private int academyId;

    @Column(name = "is_pay", nullable = false)
    private String isPay;
}
