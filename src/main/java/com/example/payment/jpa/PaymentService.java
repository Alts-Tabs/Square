package com.example.payment.jpa;

import com.example.classes.entity.ClassesEntity;
import com.example.classes.jpa.ClassesRepository;
import com.example.payment.entity.PaymentEntity;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final ClassesRepository classesRepository;

    @Transactional
    public void updateTuition(int classId, int tuition) {
        ClassesEntity cls = classesRepository.findById(classId)
                .orElseThrow(() -> new EntityNotFoundException("Class not found"));
        
        //값 변경
        cls.setTuition(tuition);
        
        //update: save() 호출
        classesRepository.save(cls);
    }
}
