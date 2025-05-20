package com.example.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "code")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academy_id")
    private AcademiesEntity academy;

    @Column(length = 10)
    private String subcode; // 서브계정 생성 코드

    private int people; // 코드 최대 사용자 수

    @Column(length = 10)
    private String role; // 코드로 생성 가능한 계정 권한

    private Boolean status; // 코드 사용 여부

    private LocalDateTime endday; // 코드 사용 기한
}
