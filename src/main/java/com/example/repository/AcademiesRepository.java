package com.example.repository;

import com.example.data.AcademiesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AcademiesRepository extends JpaRepository<AcademiesEntity, Integer> {
}
