package com.example.reference.jpa;

import com.example.reference.entity.CommentEntity;
import com.example.reference.entity.ReferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    List<CommentEntity> findByReferenceOrderByCreatedAtDesc(ReferenceEntity reference);
}
