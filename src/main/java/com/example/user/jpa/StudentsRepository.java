package com.example.user.jpa;

import com.example.user.entity.StudentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentsRepository extends JpaRepository<StudentsEntity, Integer> {
}
