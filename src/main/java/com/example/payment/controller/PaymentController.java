package com.example.payment.controller;

import com.example.classes.dto.ClassResponse;
import com.example.classes.entity.ClassesEntity;
import com.example.classes.jpa.ClassesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
//이건 원장의 결제 관리 창에서 반 조회를 위해 만든 레포지토리입니다
//차후 결제 기능을 위해 다양한 내용들이 만들어질 예정입니다
public class PaymentController {
    private final ClassesRepository classesRepository;

    @GetMapping("/dir/{academyId}/payment/getclass")
    public ResponseEntity<List<ClassResponse>> getPaymentClass(@PathVariable int academyId) {
        List<ClassesEntity> classes = classesRepository.findByAcademyId(academyId);

        List<ClassResponse> response = classes.stream()
                .map(c -> ClassResponse.builder()
                        .id(c.getClassId())
                        .name(c.getName())
                        .capacity(c.getCapacity())
                        .teacherId(c.getTeacher().getTeacherId())
                        .teacherName(c.getTeacher().getUser().getName())
                        .tuition(c.getTuition() != null ? c.getTuition() : 0)
                        .build()).toList();

        return ResponseEntity.ok(response);
    }
}
