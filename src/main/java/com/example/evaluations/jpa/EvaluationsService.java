package com.example.evaluations.jpa;

import com.example.evaluations.entity.EvaluationPeriod;
import com.example.evaluations.entity.EvaluationsDto;
import com.example.evaluations.entity.EvaluationsEntity;

import com.example.user.entity.StudentsEntity;
import com.example.user.entity.TeachersEntity;
import com.example.user.jpa.StudentsRepository;
import com.example.user.jpa.TeachersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EvaluationsService {
    private final EvaluationsRepository evaluationsRepository;
    private final TeachersRepository teachersRepository;
    private final StudentsRepository studentsRepository;
    /**
     * 평가 등록 프로세스
     */
    public void insertEvaluation(EvaluationsDto dto,String periods){
        EvaluationPeriod period;

        try {
            period=EvaluationPeriod.valueOf(periods.toUpperCase());
        }catch (IllegalArgumentException|NullPointerException e) {
            throw new RuntimeException("Invalid Period value" + periods);
        }

        TeachersEntity teacher = teachersRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("해당 선생님이 없습니다."));

        StudentsEntity student=studentsRepository.findById(dto.getStudentId())
                .orElseThrow(()->new RuntimeException("해당 학생이 없습니다."));

        EvaluationsEntity evaluations=EvaluationsEntity.builder()
                .teacher(teacher)
                .student(student)
                .subject(dto.getSubject())
                .score(dto.getScore())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .contents(dto.getContents())
                .period(period)
                .build();

        evaluationsRepository.save(evaluations);
    }


}
