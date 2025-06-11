package com.example.chatbot.entity;

import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.UsersEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "ChatbotConsultations")
@Builder @NoArgsConstructor @AllArgsConstructor
public class ChatBotEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UsersEntity user;

    @ManyToOne
    @JoinColumn(name = "academy_id")
    private AcademiesEntity acaId;

    @Column(name = "consultation_date")
    private LocalDateTime consultationDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}