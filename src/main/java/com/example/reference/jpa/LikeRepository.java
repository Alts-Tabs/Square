package com.example.reference.jpa;

import com.example.reference.entity.LikeEntity;
import com.example.reference.entity.ReferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    Long countByReference(ReferenceEntity reference);
    void deleteByReference(ReferenceEntity reference);  // 간단한 단일 사용자 토글용
}
