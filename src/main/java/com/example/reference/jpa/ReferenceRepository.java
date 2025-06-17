package com.example.reference.jpa;

import com.example.reference.entity.ReferenceEntity;
import com.example.user.entity.AcademiesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReferenceRepository extends JpaRepository<ReferenceEntity, Long> {
        List<ReferenceEntity> findAllByAcademyOrderByCreatedAtDesc(AcademiesEntity academy);
}