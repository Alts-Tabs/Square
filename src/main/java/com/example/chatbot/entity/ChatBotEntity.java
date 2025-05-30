package com.example.chatbot.entity;

import com.example.user.entity.UsersEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "consultations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatBotEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity user;

    @Column(nullable = false)
    private Timestamp consultationDate; // 상담 예약 날짜와 시간

    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt; // 메시지 생성 시간

    @Column(length = 500)
    private String message; // 사용자 메시지 또는 챗봇 응답

    @Column
    private Boolean isBot; // 챗봇 응답인지 여부 (true: 챗봇, false: 사용자)
}