package com.example.user.jpa;

import com.example.user.entity.CodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CodeRepository extends JpaRepository<CodeEntity, Integer> {
    Optional<CodeEntity> findBySubcode(String subcode);
}
