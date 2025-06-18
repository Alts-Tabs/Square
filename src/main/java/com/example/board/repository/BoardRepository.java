package com.example.board.repository;

import com.example.board.entity.BoardEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<BoardEntity, Long> {
    Page<BoardEntity> findByCategory(String category, Pageable pageable);
    Page<BoardEntity> findByCategoryAndTitleContaining(String category, String keyword, Pageable pageable);
    Page<BoardEntity> findByCategoryAndContentContaining(String category, String keyword, Pageable pageable);
    Page<BoardEntity> findByCategoryAndTitleContainingOrContentContaining(String category, String titleKeyword, String contentKeyword, Pageable pageable);
}