package com.example.user.jpa;

import com.example.user.dto.TeacherDto;
import com.example.user.entity.TeachersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeachersRepository extends JpaRepository<TeachersEntity, Integer> {
    // academy_id로 선생 목록 조회
    @Query("SELECT t FROM TeachersEntity t WHERE t.academy.academyId = :academyId")
    List<TeachersEntity> findByAcademyId(@Param("academyId") int academyId);

    //userId로 teacherId 검색하기
    @Query("SELECT t FROM TeachersEntity t WHERE t.user.user_id = :userId")
    Optional<TeachersEntity> findByUserUserId(@Param("userId") int userId);

    // userId로 해당 강사의 과목명 + 이름 조회
    @Query("SELECT new com.example.user.dto.TeacherDto(t.subject, t.user.name) FROM TeachersEntity t WHERE t.user.user_id = :userId")
    List<TeacherDto> findTeacherDtosByUserId(@Param("userId") int userId);

    // 전체 강사의 과목명 + 이름 조회
    @Query("SELECT new com.example.user.dto.TeacherDto(t.subject, t.user.name) FROM TeachersEntity t")
    List<TeacherDto> findAllTeacherDtos();

    //academyId에 해당하는 전체 선생님 목록 조회(users 테이블에서 name값도 같이 조회)
    @Query("SELECT new com.example.user.dto.TeacherDto(t.teacherId, u.name, t.subject) " +
            "FROM TeachersEntity t " +
            "JOIN UsersEntity u ON t.user.user_id = u.user_id " +
            "WHERE t.academy.academyId = :acaId")
    List<TeacherDto> findTeachersByAcaId(@Param("acaId") int acaId);

}
