package com.example.chatbot.service;

import com.example.chatbot.Dto.ConsultationDto;
import com.example.chatbot.repository.ChatBotMessageRepository;
import com.example.user.entity.AcademiesEntity;
import com.example.user.jpa.AcademiesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    private final ChatBotMessageRepository chatBotMessageRepository;
    private final AcademiesRepository academiesRepository;

    public List<ConsultationDto> getConsultationByAcademyId(int academyId) {
        AcademiesEntity academy = academiesRepository.findById(academyId)
                .orElseThrow(() -> new IllegalArgumentException("NOT EXIST ACADEMY"));
        return chatBotMessageRepository.findByAcaId(academy);
    }
}
