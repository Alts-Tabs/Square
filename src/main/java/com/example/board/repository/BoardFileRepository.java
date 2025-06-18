package com.example.board.repository;

import com.example.board.entity.BoardFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardFileRepository extends JpaRepository<BoardFileEntity, Long> {
    List<BoardFileEntity> findByPostId(Long postId);

    void deleteAllByPostId(Long id);
}