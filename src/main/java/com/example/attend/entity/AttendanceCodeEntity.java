package com.example.attend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "attendance_code")
public class AttendanceCodeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int attendance_code_id;

    @Column(nullable = false)
    private int idx;

    @Column(nullable = false)
    private int code;

    @Column(nullable = false, updatable = false)
    private LocalDateTime created_at = LocalDateTime.now();
}

