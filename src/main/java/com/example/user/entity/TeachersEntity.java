package com.example.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "teachers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeachersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int teacher_id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academy_id", nullable = false)
    private AcademiesEntity academy;

    @Column(length = 50)
    private String subject;
}
