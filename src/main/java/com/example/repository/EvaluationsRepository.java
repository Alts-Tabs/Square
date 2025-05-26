package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.data.EvaluationsEntity;

import java.util.List;

public interface EvaluationsRepository extends JpaRepository<EvaluationsEntity, Integer> {
    //특정 학생의 평가 목록 조회
    List<EvaluationsEntity> selectByStudEntityList(int student_id);

    //점수가 특정 값 이상인 평가 목록 조회(통계에서 사용될 예정)
    List<EvaluationsEntity> selectByScore(int score);

    //기간으료 평가 목록 조회
    List<EvaluationsEntity> findByDate(String startDate, String endDate);


}
