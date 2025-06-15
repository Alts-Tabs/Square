package com.example.attend.entity;

import com.example.user.entity.StudentsEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private int attendances_id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private StudentsEntity student;

    @Column(nullable = false)
    private int idx;  // timetableAttend와 연동

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ABSENT;

    private LocalDateTime verified_at;

    public enum Status {
        PRESENT, ABSENT, LATE
    }

    @ManyToOne
    @JoinColumn(name = "timetable_attend_id")
    private TimetableAttendEntity timetableAttend;

}

