package com.example.payment.service;

import com.example.classes.entity.ClassesEntity;
import com.example.classes.jpa.ClassesRepository;
import com.example.payment.dto.PaymentEnrollDto;
import com.example.payment.entity.EnrollEntity;
import com.example.payment.jpa.PaymentChildrenRepository;
import com.example.payment.jpa.PaymentEnrollRepository;
import com.example.payment.jpa.PaymentGetClassRepository;
import com.example.user.dto.StudentDto;
import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.ParentsEntity;
import com.example.user.entity.StudentsEntity;
import com.example.user.jpa.AcademiesRepository;
import com.example.user.jpa.ParentsRepository;
import com.example.user.jpa.StudentsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentGetClassRepository paymentGetClassRepository;
    private final PaymentChildrenRepository paymentChildrenRepository;
    private final PaymentEnrollRepository paymentEnrollRepository;
    private final ParentsRepository parentsRepository;
    private final StudentsRepository studentsRepository;
    private final ClassesRepository classesRepository;
    private final AcademiesRepository academiesRepository;

    @Transactional
    public void updateTuition(int classId, int tuition) {
        paymentGetClassRepository.updateTuitionByClassId(classId, tuition);
    }

    @Transactional
    public List<StudentsEntity> getChildrenByParentId(int parentId) {
        return paymentChildrenRepository.getChildrenByParentId(parentId);
    }

    //장바구니에 해당하는 enroll DB 에 insert 하는 방법
    //jpql 에서는 EntityManager 를 활용해서 insert 를 구현하기 때문에
    //save 를 사용한다.
    @Transactional
    public PaymentEnrollDto insertEnrollClass(int academyId, int parentId, int studentId, PaymentEnrollDto dto) {
        ParentsEntity parent = parentsRepository.findById(dto.getParentId())
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        StudentsEntity student = studentsRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        ClassesEntity classes = classesRepository.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        EnrollEntity enroll = EnrollEntity.builder()
                .enrollId(dto.getEnrollId())
                .parent(parent)
                .student(student)
                .classes(classes)
                .duration(dto.getDuration())
                .academyId(classes.getAcademy().getAcademyId())
                .build();

        EnrollEntity saved = paymentEnrollRepository.save(enroll);

        return PaymentEnrollDto.builder()
                .enrollId(saved.getEnrollId())
                .parentId(parentId)
                .studentId(studentId)
                .classId(dto.getClassId())
                .duration(dto.getDuration())
                .build();
    }
}
