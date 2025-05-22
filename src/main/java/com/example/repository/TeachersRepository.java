package com.example.repository;

import com.example.data.TeachersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeachersRepository extends JpaRepository<TeachersEntity, Integer> {
}
