package com.example.payment.controller;

import com.example.classes.dto.ClassResponse;
import com.example.classes.entity.ClassesEntity;
import com.example.classes.jpa.ClassesRepository;
import com.example.payment.dto.PaymentGetChildrenDto;
import com.example.payment.service.PaymentService;
import com.example.user.dto.StudentDto;
import com.example.user.entity.StudentsEntity;
import com.example.user.service.StudentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@CrossOrigin
//이건 원장의 결제 관리 창에서 반 조회를 위해 만든 레포지토리입니다
//차후 결제 기능을 위해 다양한 내용들이 만들어질 예정입니다
public class PaymentController {
    private final ClassesRepository classesRepository;
    private final PaymentService paymentService;
    private final StudentsService studentsService;

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

    //학부모가 수업을 선택하면 그 아래에 자녀를 선택하게 하기
    //새로만든 dto 를 통해 자녀 이름만 받아올 수 있게 구현
    @GetMapping("/parent/{roleId}/students")
    public ResponseEntity<List<PaymentGetChildrenDto>> getStudentsByParentId(@PathVariable int roleId) {
        List<StudentsEntity> students = paymentService.getChildrenByParentId(roleId);

        //JSON 무한루프를 피하기 위해서 Dto 를 통해 2차적으로 response 로 받아와서 GET
        //자녀가 여러 명인 경우를 대비해 map()으로 반복적으로 묶어준다
        List<PaymentGetChildrenDto> response = students.stream()
                .map(s -> new PaymentGetChildrenDto(s.getStudentId(),
                        s.getUser().getName())) //테이블의 id 값과 이름을 반복적으로 받아온다.
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    //학부모가 장바구니에 넣으면 enroll에 등록이 되어야 함
//    @PostMapping("/parent/payment/{academyId}/{parentId}")
//    public ResponseEntity<?> registerClassEnrollment(@PathVariable int academyId, @PathVariable int parentId)
//    {
//
//    }
}