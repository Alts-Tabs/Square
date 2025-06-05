package com.example.payment.service;

import com.example.payment.jpa.PaymentChildrenRepository;
import com.example.payment.jpa.PaymentGetClassRepository;
import com.example.user.dto.StudentDto;
import com.example.user.entity.StudentsEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentGetClassRepository paymentGetClassRepository;
    private final PaymentChildrenRepository paymentChildrenRepository;

    @Transactional
    public void updateTuition(int classId, int tuition) {
        paymentGetClassRepository.updateTuitionByClassId(classId, tuition);
    }

    @Transactional
    public List<StudentsEntity> getChildrenByParentId(int parentId) {
        return paymentChildrenRepository.getChildrenByParentId(parentId);
    }

}
