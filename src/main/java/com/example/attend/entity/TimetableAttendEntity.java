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
    private TimetableEntity timetable_id;

    @ManyToOne
    @JoinColumn(name = "attendance_code_id")
    private AttendanceCodeEntity attendanceCode;

    @ManyToOne
    private TimecontentsEntity timecontents_id;

}
