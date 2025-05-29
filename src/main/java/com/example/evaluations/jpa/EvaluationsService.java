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

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluationsService {
    private final EvaluationsRepository evaluationsRepository;
    private final TeachersRepository teachersRepository;
    private final StudentsRepository studentsRepository;
    /** * 평가 등록 프로세스 */
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

    //evaluationStudent 페이지 진입 시 userId를 받아서 전체 목록 조회
    public List<EvaluationsDto> getStudentEvaluations(int userId) {
        StudentsEntity student = studentsRepository.findByUserId(userId);
        if (student == null) {
            throw new RuntimeException("해당 학생 정보가 없습니다.");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(ZoneId.of("Asia/Seoul"));

        List<EvaluationsEntity> entities = evaluationsRepository.findByDynamicConditions(
                student.getStudentId(), null, null, null, null
        );
        return entities.stream()
                .map(e-> {
                    EvaluationsDto dto=new EvaluationsDto();
                    dto.setSubject(e.getSubject());
                    dto.setScore(e.getScore());
                    dto.setContents(e.getContents());
                    dto.setStartDate(e.getStartDate());
                    dto.setEndDate(e.getEndDate());
                    dto.setCreated_at(formatter.format(e.getCreated_at().toInstant()));
                    dto.setTeacherId(e.getTeacher().getTeacherId());
                    dto.setStudentId(e.getStudent().getStudentId());
                    dto.setTeacherName(e.getTeacher().getUser().getName());
                    return  dto;
                })
                .collect(Collectors.toList());
    }


    // 학생으로 로그인 시 조건에 맞는 조회 결과 노출
    public List<EvaluationsDto> searchStudentEvaluations(int userId, String subject, String period, String startDate, String endDate) {
        StudentsEntity student = studentsRepository.findByUserId(userId);
        if (student == null) {
            throw new RuntimeException("해당 학생 정보가 없습니다.");
        }

        EvaluationPeriod evalPeriod = null;
        if (period != null && !period.isEmpty()) {
            try {
                evalPeriod = EvaluationPeriod.valueOf(period.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid Period value: " + period);
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(ZoneId.of("Asia/Seoul"));

        List<EvaluationsEntity> entities = evaluationsRepository.findByDynamicConditions(
                student.getStudentId(), subject, evalPeriod, startDate, endDate
        );

        return entities.stream()
                .map(e -> {
                    EvaluationsDto dto = new EvaluationsDto();
                    dto.setSubject(e.getSubject());
                    dto.setScore(e.getScore());
                    dto.setContents(e.getContents());
                    dto.setStartDate(e.getStartDate());
                    dto.setEndDate(e.getEndDate());
                    dto.setCreated_at(formatter.format(e.getCreated_at().toInstant()));
                    dto.setTeacherId(e.getTeacher().getTeacherId());
                    dto.setStudentId(e.getStudent().getStudentId());
                    dto.setTeacherName(e.getTeacher().getUser().getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

}
