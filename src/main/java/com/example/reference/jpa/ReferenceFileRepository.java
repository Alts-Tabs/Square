package com.example.reference.jpa;

import com.example.reference.entity.ReferenceFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReferenceFileRepository extends JpaRepository<ReferenceFileEntity, Long> {
}
