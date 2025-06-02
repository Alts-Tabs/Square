package com.example.reference.service;

import com.example.reference.dto.LikeDto;
import com.example.reference.entity.LikeEntity;
import com.example.reference.entity.ReferenceEntity;
import com.example.reference.jpa.LikeRepository;
import com.example.reference.jpa.ReferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final ReferenceRepository referenceRepository;

    public LikeDto toggleLike(Long referenceId) {
        ReferenceEntity reference = referenceRepository.findById(referenceId)
                .orElseThrow(() -> new IllegalArgumentException("자료글을 찾을 수 없습니다."));

        // 일단 기존 좋아요 전부 삭제 (단순 토글용)
        likeRepository.deleteByReference(reference);

        // 새로 추가
        LikeEntity like = LikeEntity.builder().reference(reference).build();
        likeRepository.save(like);

        Long count = likeRepository.countByReference(reference);
        return LikeDto.builder().referenceId(referenceId).likeCount(count).build();
    }

    public LikeDto getLikeCount(Long referenceId) {
        ReferenceEntity reference = referenceRepository.findById(referenceId)
                .orElseThrow(() -> new IllegalArgumentException("자료글을 찾을 수 없습니다."));

        Long count = likeRepository.countByReference(reference);
        return LikeDto.builder().referenceId(referenceId).likeCount(count).build();
    }
}
