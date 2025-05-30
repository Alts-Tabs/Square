package com.example.chatbot.repository;


import com.example.chatbot.entity.ChatBotEntity;
import com.example.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatBotMessageRepository extends JpaRepository<ChatBotEntity, Long> {
    List<ChatBotEntity> findByUserOrderByConsultationDateDesc(UsersEntity user);
    List<ChatBotEntity> findByUserOrderByCreatedAtAsc(UsersEntity user);
}