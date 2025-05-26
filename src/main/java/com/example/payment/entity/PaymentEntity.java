package com.example.payment.entity;

import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.ParentsEntity;
import com.example.user.entity.StudentsEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="classes")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int payment_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academy_id", nullable = false)
    private AcademiesEntity academy;

    //ClassEntity 만들면 연결할 생각
    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "class_id", nullable = false)
    //private ClassEntity class;

    @Column(length = 100)
    private String duration_month;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ParentsEntity parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private StudentsEntity student;
}
