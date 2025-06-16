package com.example.attend.entity;

import com.example.timetable.entity.TimecontentsEntity;
import com.example.timetable.entity.TimetableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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

    // 관계 매핑
    @OneToMany(mappedBy = "timetableAttend", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @Builder.Default
    private List<AttendancesEntity> attendances = new ArrayList<>();

    @OneToMany(mappedBy = "timetableAttend", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @Builder.Default
    private List<AttendanceCodeEntity> attendanceCodes = new ArrayList<>();
}
