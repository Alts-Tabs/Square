package com.example.timetable.repository;

import com.example.timetable.dto.TimecontentsDto;
import com.example.timetable.entity.TimecontentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface TimecontentsRepository extends JpaRepository<TimecontentsEntity, Integer> {

    /**timetableId 기준으로 조회*/
    List<TimecontentsEntity> findByTimetable_TimetableId(int timetableId);

    void deleteByTimetable_timetableId(int timetableId);

    // 교사용: 오늘 요일에 해당하며, 현재 시간 내에 있고, 수업의 교사가 일치하는 경우
    @Query("""
    SELECT tc FROM TimecontentsEntity tc
    WHERE tc.dayOfWeek = :dayOfWeek
    AND :currentTime BETWEEN tc.startTime AND tc.endTime
    AND tc.classes.teacher.user.user_id = :userId
    """)
    Optional<TimecontentsEntity> findCurrentClassForTeacher(
            @Param("userId") Integer userId,
            @Param("dayOfWeek") int dayOfWeek,
            @Param("currentTime") LocalTime currentTime
    );

    // 학생용: 특정 클래스에 속하며, 오늘 요일과 현재 시간에 해당하는 수업
    @Query("""
    SELECT tc FROM TimecontentsEntity tc
    WHERE tc.dayOfWeek = :dayOfWeek
    AND :currentTime BETWEEN tc.startTime AND tc.endTime
    AND tc.classes.classId = :classId
""")
    Optional<TimecontentsEntity> findCurrentClassForClass(
            @Param("classId") Integer classId,
            @Param("dayOfWeek") int dayOfWeek,
            @Param("currentTime") LocalTime currentTime
    );
}
