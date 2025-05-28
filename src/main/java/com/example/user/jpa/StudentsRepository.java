package com.example.user.jpa;

import com.example.user.dto.StudentDto;
import com.example.user.entity.StudentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentsRepository extends JpaRepository<StudentsEntity, Integer> {
    List<StudentsEntity> findAllByAcademy_AcademyId(int academyId);

    // 이름 검색
    List<StudentsEntity> findByAcademy_AcademyIdAndUser_NameContaining(int academyId, String nameKeyword);

    @Query("SELECT new com.example.user.dto.StudentDto(s.studentId, u.name) FROM StudentsEntity s JOIN s.user u")
    List<StudentDto> findAllWithUserNames();
}
