package com.example.reference.jpa;

import com.example.reference.entity.ReferenceEntity;
import com.example.reference.entity.ReferenceFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferenceFileRepository extends JpaRepository<ReferenceFileEntity, Long> {
    List<ReferenceFileEntity> findByReference(ReferenceEntity reference);
}
