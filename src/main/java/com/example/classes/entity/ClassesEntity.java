package com.example.classes.entity;

import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.TeachersEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "classes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private int classId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academy_id")
    private AcademiesEntity academy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private TeachersEntity teacher;

    @Column(nullable = true)
    private Integer tuition; // 수업료 (nullable 허용 - 추후 설정)

    @Builder.Default
    @Column(name = "capacity", columnDefinition = "INT DEFAULT 30")
    private Integer capacity = 30;

    @Column(length = 100, nullable = false)
    private String name; // 클래스명

    // 양방향 매핑
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ClassUsersEntity> classUsers = new ArrayList<>();
}
