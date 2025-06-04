package com.example.timetable.entity;

import com.example.classes.entity.ClassesEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalTime;

@Entity
@Table(name ="timecontents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimecontentsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timecontent_Id")
    private int timecontentsId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="timetable_id", nullable=false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private TimetableEntity timetable;

    @Column(name = "startTime", nullable = false)
    private LocalTime startTime;

    @Column(name = "endTime", nullable = false)
    private LocalTime endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="class_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ClassesEntity classes;

    @Column(name = "type",length = 50)
    private String type;

}
