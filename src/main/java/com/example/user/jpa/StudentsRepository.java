package com.example.user.jpa;

import com.example.user.entity.StudentsEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentsRepository extends JpaRepository<StudentsEntity, Integer> {
    Page<StudentsEntity> findAllByAcademy_AcademyId(int academyId, Pageable pageable);

    // 이름 검색
    List<StudentsEntity> findByAcademy_AcademyIdAndUser_NameContaining(int academyId, String nameKeyword);
}
