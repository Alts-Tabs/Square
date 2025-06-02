package com.example.reference.service;

import com.example.reference.dto.CommentDto;
import com.example.reference.entity.CommentEntity;
import com.example.reference.entity.ReferenceEntity;
import com.example.reference.jpa.CommentRepository;
import com.example.reference.jpa.ReferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ReferenceRepository referenceRepository;

    public CommentDto createComment(Long referenceId, String content) {
        ReferenceEntity reference = referenceRepository.findById(referenceId)
                .orElseThrow(() -> new IllegalArgumentException("자료글을 찾을 수 없습니다."));

        CommentEntity comment = CommentEntity.builder()
                .content(content)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .reference(reference)
                .build();

        CommentEntity saved = commentRepository.save(comment);
        return toDto(saved);
    }

    public List<CommentDto> getCommentsByReference(Long referenceId) {
        ReferenceEntity reference = referenceRepository.findById(referenceId)
                .orElseThrow(() -> new IllegalArgumentException("자료글을 찾을 수 없습니다."));

        return commentRepository.findByReferenceOrderByCreatedAtDesc(reference)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CommentDto updateComment(Long commentId, String content) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        comment.setContent(content);
        comment.setUpdatedAt(LocalDateTime.now());

        return toDto(commentRepository.save(comment));
    }

    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    private CommentDto toDto(CommentEntity comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .referenceId(comment.getReference().getId())
                .build();
    }
}
