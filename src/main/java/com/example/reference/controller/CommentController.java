package com.example.reference.controller;

import com.example.reference.dto.CommentDto;
import com.example.reference.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDto> create(@RequestParam Long referenceId,
                                             @RequestParam String content) {
        return ResponseEntity.ok(commentService.createComment(referenceId, content));
    }

    @GetMapping("/{referenceId}")
    public ResponseEntity<List<CommentDto>> getByReference(@PathVariable Long referenceId) {
        return ResponseEntity.ok(commentService.getCommentsByReference(referenceId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDto> update(@PathVariable Long commentId,
                                             @RequestParam String content) {
        return ResponseEntity.ok(commentService.updateComment(commentId, content));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
