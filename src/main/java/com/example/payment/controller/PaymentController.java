package com.example.payment.controller;

import com.example.classes.dto.ClassResponse;
import com.example.classes.entity.ClassesEntity;
import com.example.classes.jpa.ClassesRepository;
import com.example.payment.jpa.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin
//이건 원장의 결제 관리 창에서 반 조회를 위해 만든 레포지토리입니다
//차후 결제 기능을 위해 다양한 내용들이 만들어질 예정입니다
public class PaymentController {
    private final ClassesRepository classesRepository;
    private final PaymentService paymentService;

    @GetMapping("/dir/{academyId}/payment/getclass")
    public ResponseEntity<List<ClassResponse>> getPaymentClass(@PathVariable int academyId) {
        List<ClassesEntity> classes = classesRepository.findByAcademyId(academyId);

        List<ClassResponse> response = classes.stream()
                .map(c -> ClassResponse.builder()
                        .id(c.getClass_id())
                        .name(c.getName())
                        .capacity(c.getCapacity())
                        .teacherId(c.getTeacher().getTeacher_id())
                        .teacherName(c.getTeacher().getUser().getName())
                        .tuition(c.getTuition() != null ? c.getTuition() : 0)
                        .build()).toList();

        return ResponseEntity.ok(response);
    }

    //수업료 수정하는 부분
    @PatchMapping("/dir/{classId}/payment/UpdateTuiton")
    public ResponseEntity<ClassesEntity> updateTuiton(@PathVariable int classId,
                                                      @RequestBody Map<String, Object> payload) {
        int tuition = Integer.parseInt(payload.get("tuition").toString());
        paymentService.updateTuition(classId, tuition);
        return ResponseEntity.ok().build();
    }
}