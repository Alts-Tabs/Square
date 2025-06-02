package com.example.reference.controller;

import com.example.reference.dto.ReferenceReplyDto;
import com.example.reference.service.ReferenceReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/references/{referenceId}/replies")
@RequiredArgsConstructor
public class ReferenceReplyController {

    private final ReferenceReplyService replyService;

    // 댓글 생성
    @PostMapping
    public ResponseEntity<ReferenceReplyDto> createReply(
            @PathVariable Long referenceId,
            @RequestParam String content) {
        ReferenceReplyDto created = replyService.createReply(referenceId, content);
        return ResponseEntity.ok(created);
    }

    // 댓글 목록 조회
    @GetMapping
    public ResponseEntity<List<ReferenceReplyDto>> getReplies(@PathVariable Long referenceId) {
        List<ReferenceReplyDto> replies = replyService.getReplies(referenceId);
        return ResponseEntity.ok(replies);
    }

    // 댓글 수정
    @PutMapping("/{replyId}")
    public ResponseEntity<ReferenceReplyDto> updateReply(
            @PathVariable Long referenceId,
            @PathVariable Long replyId,
            @RequestParam String content) {
        ReferenceReplyDto updated = replyService.updateReply(replyId, content);
        return ResponseEntity.ok(updated);
    }

    // 댓글 삭제
    @DeleteMapping("/{replyId}")
    public ResponseEntity<Void> deleteReply(
            @PathVariable Long referenceId,
            @PathVariable Long replyId) {
        replyService.deleteReply(replyId);
        return ResponseEntity.noContent().build();
    }
}
