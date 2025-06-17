package com.example.reference.jpa;

import com.example.reference.entity.ReferenceCategoryEntity;
import com.example.user.entity.AcademiesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReferenceCategoryRepository extends JpaRepository<ReferenceCategoryEntity, Long> {
    List<ReferenceCategoryEntity> findAllByAcademy(AcademiesEntity academy);
}
