package com.example.user.entity;

import com.example.classes.entity.ClassesEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teachers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeachersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int teacher_id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academy_id", nullable = false)
    private AcademiesEntity academy;

    @Column(length = 50)
    private String subject;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @Builder.Default
    private List<ClassesEntity> classes = new ArrayList<>(); // 내가 맡은 클래스 목록 조회
}
