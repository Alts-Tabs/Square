package com.example.user.jpa;

import com.example.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UsersRepository extends JpaRepository<UsersEntity, Integer> {
    Boolean existsByUsername(String username); // username 존재 여부(true/false)
    UsersEntity findByUsername(String username); // username 에 맞는 UsersEntity 반환

    // 접두사 확인용
    @Query("SELECT u.username FROM UsersEntity u WHERE u.username LIKE CONCAT(:prefix, '%')")
    List<String> findUsernamesStartingWith(@Param("prefix") String prefix);
}
