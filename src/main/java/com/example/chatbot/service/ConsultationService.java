package com.example.chatbot.service;

import com.example.chatbot.Dto.ConsultationDto;
import com.example.chatbot.entity.ChatBotEntity;
import com.example.chatbot.repository.ChatBotMessageRepository;
import com.example.user.entity.AcademiesEntity;
import com.example.user.jpa.AcademiesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    private final ChatBotMessageRepository chatBotMessageRepository;
    private final AcademiesRepository academiesRepository;

    // 출력
    public List<ConsultationDto> getConsultationByAcademyId(int academyId) {
        AcademiesEntity academy = academiesRepository.findById(academyId)
                .orElseThrow(() -> new IllegalArgumentException("NOT EXIST ACADEMY"));
        return chatBotMessageRepository.findByAcaId(academy);
    }

    // 삭제
    public void deleteConsultation(Long id) {
        chatBotMessageRepository.deleteById(id);
    }

    // 수정
    @Transactional
    public void updateConsultationDate(Long id, LocalDateTime newDateTime) {
        ChatBotEntity consultation = chatBotMessageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("NOT EXIST consultation"));
        consultation.setConsultationDate(newDateTime);
    }
}
