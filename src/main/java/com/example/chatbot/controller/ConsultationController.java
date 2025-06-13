package com.example.chatbot.controller;

import com.example.chatbot.Dto.ConsultationDto;
import com.example.chatbot.service.ConsultationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @DeleteMapping("/th/{id}/consultation")
    public void deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
    }

    @PatchMapping("/th/{id}/consultation")
    public void updateConsultationDate(@PathVariable Long id, @RequestBody LocalDateTime newDateTime) {
        consultationService.updateConsultationDate(id, newDateTime);
    }
}
