package com.example.attend.entity;

import com.example.timetable.entity.TimecontentsEntity;
import com.example.timetable.entity.TimetableEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "timetable_attend")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetableAttendEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timetable_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private TimetableEntity timetable;

    // 요일
    @Column(name = "day_of_week", nullable = false)
    private int dayOfWeek;

    // 출석일
    @Column(name = "attend_start", nullable = false)
    @DateTimeFormat(pattern = "HH:mm:ss")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalDateTime attendStart;

    // 관계 매핑
    @OneToMany(mappedBy = "timetableAttend", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @Builder.Default
    private List<AttendancesEntity> attendances = new ArrayList<>();

    @OneToMany(mappedBy = "timetableAttend", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @Builder.Default
    private List<AttendanceCodeEntity> attendanceCodes = new ArrayList<>();
}