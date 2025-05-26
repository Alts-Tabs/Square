package com.example.user.jpa;

import com.example.user.entity.TeachersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeachersRepository extends JpaRepository<TeachersEntity, Integer> {
}
