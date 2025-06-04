package com.example.timetable.entity;

import com.example.user.entity.StudentsEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name="timeusers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeusersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timeuser_id")
    private int timeuserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private StudentsEntity student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timetable_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private TimetableEntity timetable;
}
