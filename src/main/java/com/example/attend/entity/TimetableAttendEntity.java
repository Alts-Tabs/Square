package com.example.attend.entity;

import com.example.timetable.entity.TimecontentsEntity;
import com.example.timetable.entity.TimetableEntity;
import jakarta.persistence.*;
import lombok.*;

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

    @ManyToOne
    @JoinColumn(name = "timetable_id", nullable = false)
    private TimetableEntity timetable;

    @ManyToOne
    @JoinColumn(name = "attendance_id", nullable = false)
    private AttendanceCodeEntity attendanceCode;

    @ManyToOne
    @JoinColumn(name = "timecontents_id", nullable = false)
    private TimecontentsEntity timecontents;

}
