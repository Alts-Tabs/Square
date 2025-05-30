package com.example.user.controller;

import com.example.user.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class ParentController {
    private final ParentService parentService;

    @GetMapping("/parent/getParentId")
    public ResponseEntity<Integer> getParentId(@RequestParam int userId) {
        int parentId=parentService.getParentIdByUserId(userId);
        return ResponseEntity.ok(parentId);
    }

}
