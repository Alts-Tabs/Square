package com.example.attend.entity;

import com.example.user.entity.StudentsEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attendances")
public class AttendancesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private int attendancesId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private StudentsEntity student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idx", nullable = false)
    private TimetableAttendEntity timetableAttend;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.ABSENT;

    private LocalDateTime verified_at;

    public enum Status {
        PRESENT, ABSENT, LATE
    }
}

