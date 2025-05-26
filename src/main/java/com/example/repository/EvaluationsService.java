package com.example.repository;

import com.example.data.EvaluationPeriod;
import com.example.data.EvaluationsDto;
import com.example.data.EvaluationsEntity;
import com.example.data.TeachersEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EvaluationsService {
    private final EvaluationsRepository evaluationsRepository;
    private final TeachersRepository teachersRepository;
    /**
     * 평가 등록 프로세스
     */
    public void inserEvaluation(EvaluationsDto dto,String periods){
        EvaluationPeriod period;

        try {
            period=EvaluationPeriod.valueOf(periods.toUpperCase());
        }catch (IllegalArgumentException|NullPointerException e) {
            throw new RuntimeException("Invalid Period value" + periods);
        }

        TeachersEntity teacher = teachersRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("해당 선생님이 없습니다."));

        EvaluationsEntity evaluations=EvaluationsEntity.builder()
                .teacher(teacher)
                .studentId(dto.getStudentId())
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
