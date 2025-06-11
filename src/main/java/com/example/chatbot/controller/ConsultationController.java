package com.example.chatbot.controller;

import com.example.chatbot.Dto.ConsultationDto;
import com.example.chatbot.service.ConsultationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class ConsultationController {
    private final ConsultationService consultationService;

    @GetMapping("/public/{academyId}/consultations")
    public List<ConsultationDto> getConsultationsByAcademyId(@PathVariable int academyId) {
        return consultationService.getConsultationByAcademyId(academyId);
    }
}
