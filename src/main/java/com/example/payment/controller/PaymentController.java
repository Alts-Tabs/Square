package com.example.payment.controller;

import com.example.classes.dto.ClassResponse;
import com.example.classes.entity.ClassesEntity;
import com.example.classes.jpa.ClassesRepository;
import com.example.payment.service.PaymentService;
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
                        .id(c.getClassId())
                        .name(c.getName())
                        .capacity(c.getCapacity())
                        .teacherId(c.getTeacher().getTeacherId())
                        .teacherName(c.getTeacher().getUser().getName())
                        .tuition(c.getTuition() != null ? c.getTuition() : 0)
                        .build()).toList();

        return ResponseEntity.ok(response);
    }

    //수업료 수정하는 부분
    //403 에러가 발생 -
    @PostMapping("/dir/{classId}/payment/UpdateTuition")
    public ResponseEntity<?> updateTuition(@PathVariable int classId,
                                          @RequestBody Map<String, Object> payload)
    /*
    payload 는 { "tuition": 50000 } 과 같이 json body 로 받아오는데
    여기서 Map<String, Object> 사용함.
    */
    {
        int tuition = Integer.parseInt(payload.get("tuition").toString());

        paymentService.updateTuition(classId, tuition);
        return ResponseEntity.ok().build();
    }
    
    //학부모가 결제한 이력을 조회하는 부분
    //학원 id와 학부모 id로 매핑을 잡아서 특정 학원에 자녀를 둔 학부모의 결제 내역을 확인하도록 한다
    //결제 과정을 디자인 과정에서보다 수정할 필요 있음
    // 학원 내 모든 클래스 정보 불러오기
    @GetMapping("/parent/{academyId}/classes")
    public ResponseEntity<List<ClassResponse>> getClassesByAcademy(@PathVariable int academyId) {
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

    //학부모가 장바구니에 넣으면 enroll에 등록이 되어야 함
//    @PostMapping("/parent/payment/{academyId}/{parentId}")
//    public ResponseEntity<?> registerClassEnrollment(@PathVariable int academyId, @PathVariable int parentId)
//    {
//
//    }
}