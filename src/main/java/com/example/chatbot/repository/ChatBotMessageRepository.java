package com.example.chatbot.repository;


import com.example.chatbot.Dto.ConsultationDto;
import com.example.chatbot.entity.ChatBotEntity;
import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatBotMessageRepository extends JpaRepository<ChatBotEntity, Long> {
    List<ChatBotEntity> findByUserOrderByConsultationDateDesc(UsersEntity user);
    List<ChatBotEntity> findByUserOrderByCreatedAtAsc(UsersEntity user);

    // 상담일정 출력
    @Query("SELECT new com.example.chatbot.Dto.ConsultationDto(c.user.name, c.consultationDate) " +
            "FROM ChatBotEntity c " +
            "WHERE c.acaId = :academy")
    List<ConsultationDto> findByAcaId(AcademiesEntity academy);
}