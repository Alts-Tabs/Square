package com.example.payment.jpa;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentGetClassRepository paymentGetClassRepository;

    @Transactional
    public void updateTuition(int classId, int tuition) {
        paymentGetClassRepository.updateTuitionByClassId(classId, tuition);
    }
}
