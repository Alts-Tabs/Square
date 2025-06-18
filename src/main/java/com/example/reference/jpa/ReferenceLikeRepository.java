package com.example.reference.jpa;

import com.example.reference.entity.ReferenceEntity;
import com.example.reference.entity.ReferenceLikeEntity;
import com.example.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReferenceLikeRepository extends JpaRepository<ReferenceLikeEntity, Long> {
    // 특정 글의 좋아요 수 (status = true)
    long countByReference_IdAndStatusTrue(Long referenceId);

    // 특정 유저가 특정 글에 좋아요를 눌렀는지 여부
    Optional<ReferenceLikeEntity> findByUserAndReference(UsersEntity user, ReferenceEntity reference);
}
