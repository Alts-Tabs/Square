package com.example.reference.jpa;

import com.example.reference.entity.ReferenceReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReferenceReplyRepository extends JpaRepository<ReferenceReplyEntity, Long> {
    List<ReferenceReplyEntity> findByReferenceId(Long referenceId);
}
