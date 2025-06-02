package com.example.reference.controller;

import com.example.reference.dto.LikeDto;
import com.example.reference.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/{referenceId}")
    public ResponseEntity<LikeDto> toggleLike(@PathVariable Long referenceId) {
        return ResponseEntity.ok(likeService.toggleLike(referenceId));
    }

    @GetMapping("/{referenceId}")
    public ResponseEntity<LikeDto> getCount(@PathVariable Long referenceId) {
        return ResponseEntity.ok(likeService.getLikeCount(referenceId));
    }
}
