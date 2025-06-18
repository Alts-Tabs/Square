package com.example.reference.jpa;

import com.example.reference.entity.CategoryMappingEntity;
import com.example.reference.entity.ReferenceCategoryEntity;
import com.example.reference.entity.ReferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryMappingRepository extends JpaRepository<CategoryMappingEntity, Long> {
    Optional<CategoryMappingEntity> findByReference(ReferenceEntity reference);
    List<CategoryMappingEntity> findByCategory(ReferenceCategoryEntity category);
}
