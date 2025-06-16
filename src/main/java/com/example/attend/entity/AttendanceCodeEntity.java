package com.example.attend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
    private int attendanceCodeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idx", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private TimetableAttendEntity timetableAttend;

    @Column(nullable = false)
    private int code;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

