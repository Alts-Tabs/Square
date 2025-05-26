package com.example.user.entity;

import com.example.classes.entity.ClassesEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "academies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class AcademiesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int academy_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity user; // 학원 주인(원장)

    @Column(nullable = false, length = 100)
    private String aca_name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false, length = 10)
    private String aca_prefix; // 학원 접두사

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 10, nullable = false, unique = true)
    private String code; // 학원 고유 식별 코드 - 랜덤 난수 생성

    @CreationTimestamp
    @Column(updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp created_at;

    // Cascade 설정
    @Builder.Default
    @OneToMany(mappedBy = "academy", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<CodeEntity> codes = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "academy", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<TeachersEntity> teachers = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "academy", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ParentsEntity> parents = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "academy", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<StudentsEntity> students = new ArrayList<>();

    @OneToMany(mappedBy = "academy", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @Builder.Default
    private List<ClassesEntity> classes = new ArrayList<>(); // 해당 학원의 모든 클래스 목록 조회를 위함
}
