package com.example.evaluations.controller;

import com.example.evaluations.entity.EvaluationsDto;
import com.example.evaluations.jpa.EvaluationsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class EvaluationsController {
    private final EvaluationsService evaluationsService;

    @PostMapping("/insertEvaluation")
    public ResponseEntity<String> insertEvaluation(@RequestBody EvaluationsDto dto,
                                                   @RequestParam String period){

        evaluationsService.insertEvaluation(dto,period);
        return ResponseEntity.ok("평가 등록 완료");

    }



}
