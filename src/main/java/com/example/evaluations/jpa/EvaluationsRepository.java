package com.example.evaluations.jpa;

import com.example.evaluations.entity.EvaluationPeriod;
import com.example.user.dto.TeacherDto;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.evaluations.entity.EvaluationsEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EvaluationsRepository extends JpaRepository<EvaluationsEntity, Integer> {
    //특정 학생의 평가 목록 조회
    //List<EvaluationsEntity> findByStudentStudentId(int studentId);

    //점수가 특정 값 이상인 평가 목록 조회(통계에서 사용될 예정)
    List<EvaluationsEntity> findByScore(int score);

    //기간으료 평가 목록 조회
    List<EvaluationsEntity> findByStartDateGreaterThanEqualAndEndDateLessThanEqual(String startDate, String endDate);

    //userId를 받아서 studentId에 해당하는 과목 중복없이 조회 - 종합평가 학생 페이지에서 사용
    @Query("SELECT DISTINCT new com.example.user.dto.TeacherDto(e.teacher.teacherId, e.teacher.user.name, e.subject) " +
            "FROM EvaluationsEntity e WHERE e.student.studentId = :studentId")
    List<TeacherDto> findSubjectsForStudentPage(@Param("studentId") int studentId);

    //선택된 studentId에 해당하는 과목 중복없이 조회 - 종합평가 Parents 페이지에서 사용
    @Query("SELECT DISTINCT new com.example.user.dto.TeacherDto(e.teacher.teacherId, e.teacher.user.name, e.subject) " +
            "FROM EvaluationsEntity e WHERE e.student.studentId = :studentId")
    List<TeacherDto> findSubjectsForParentPage(@Param("studentId") int studentId);

    //조건에 해당하는 결과 조회 - 종합평가 학생 페이지
    @Query("SELECT e FROM EvaluationsEntity e " +
            "WHERE e.student.studentId = :studentId " +
            "AND (:subject IS NULL OR e.subject = :subject) " +
            "AND (:period IS NULL OR e.period = :period) " +
            "AND (:startDate IS NULL OR e.startDate >= :startDate) " +
            "AND (:endDate IS NULL OR e.endDate <= :endDate)")
    List<EvaluationsEntity> findByDynamicConditions(
            @Param("studentId") int studentId,
            @Param("subject") String subject,
            @Param("period") EvaluationPeriod period,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );

    /** 조건에 맞는 목록 노출 - 종합평가 학부모 페이지*/
    @Query("""
        SELECT e FROM EvaluationsEntity e
        WHERE e.student.studentId = :studentId
        AND (:subject IS NULL OR e.subject = :subject)
        AND (:period IS NULL OR e.period = :period)
        AND (:startDate IS NULL OR e.startDate >= :startDate)
        AND (:endDate IS NULL OR e.endDate <= :endDate)
    """)
    List<EvaluationsEntity> findEvaluationsForParentPage(
            @Param("studentId") int studentId,
            @Param("subject") String subject,
            @Param("period") EvaluationPeriod  period,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );

}
