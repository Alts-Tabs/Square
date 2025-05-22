package com.example.repository;

import com.example.data.ParentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParentsRepository extends JpaRepository<ParentsEntity, Integer> {
}
