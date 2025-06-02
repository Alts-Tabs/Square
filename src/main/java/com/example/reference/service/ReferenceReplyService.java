package com.example.reference.service;

import com.example.reference.dto.ReferenceReplyDto;
import com.example.reference.entity.ReferenceEntity;
import com.example.reference.entity.ReferenceReplyEntity;
import com.example.reference.jpa.ReferenceReplyRepository;
import com.example.reference.jpa.ReferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReferenceReplyService {

    private final ReferenceReplyRepository replyRepository;
    private final ReferenceRepository referenceRepository;

    // 댓글 생성
    public ReferenceReplyDto createReply(Long referenceId, String content) {
        ReferenceEntity reference = referenceRepository.findById(referenceId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다. id=" + referenceId));

        ReferenceReplyEntity reply = ReferenceReplyEntity.builder()
                .reference(reference)
                .content(content)
                .build();

        ReferenceReplyEntity saved = replyRepository.save(reply);
        return ReferenceReplyDto.fromEntity(saved);
    }

    // 댓글 목록 조회 (해당 게시글 댓글들)
    public List<ReferenceReplyDto> getReplies(Long referenceId) {
        List<ReferenceReplyEntity> replies = replyRepository.findByReferenceId(referenceId);
        return replies.stream()
                .map(ReferenceReplyDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 댓글 수정
    public ReferenceReplyDto updateReply(Long replyId, String content) {
        ReferenceReplyEntity reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다. id=" + replyId));

        reply.setContent(content);
        reply.setUpdatedAt(LocalDateTime.now());

        return ReferenceReplyDto.fromEntity(reply);
    }

    // 댓글 삭제
    public void deleteReply(Long replyId) {
        ReferenceReplyEntity reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다. id=" + replyId));
        replyRepository.delete(reply);
    }
}
