//package com.example.attend.entity;
//
//import com.example.user.entity.StudentsEntity;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "attendances")
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//
//public class AttendEntity {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "attendance_id")
//    private int attendanceId;
//
//    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @JoinColumn(name = "student_id", nullable = false)
//    private StudentsEntity student;
//
//    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @JoinColumn(name = "timetable_id", nullable = false)
//    private TimetablesEntity timetable;
//
//    @Column(length = 50)
//    private String username;
//
//    @Column(columnDefinition = "TEXT")
//    private String memo;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private Status status;
//
//    private LocalDateTime verifiedAt;
//
//    public enum Status {
//        PRESENT, ABSENT, LATE
//    }
//}
