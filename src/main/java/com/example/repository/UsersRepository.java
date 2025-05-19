package com.example.repository;

import com.example.data.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<UsersEntity, Integer> {
    Boolean existsByUsername(String username); // username 존재 여부(true/false)
    UsersEntity findByUsername(String username); // username 에 맞는 UsersEntity 반환
}
