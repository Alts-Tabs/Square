package com.example.user.controller;

import com.example.user.entity.UsersEntity;
import com.example.user.jpa.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
@RequiredArgsConstructor
public class UserSearchController {
    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    // 아이디 찾기
    @PostMapping("/public/find-username")
    public ResponseEntity<?> findUsername(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");

        Optional<UsersEntity> userOpt = usersRepository.findByNameAndEmail(name, email);
        if(userOpt.isPresent()) {
            return ResponseEntity.ok(Map.of("username", userOpt.get().getUsername()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 없음");
        }
    }

    // 비밀번호 찾기 - 사용자 확인
    @PostMapping("/public/verify-user")
    public ResponseEntity<?> verifyUser(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");

        Optional<UsersEntity> userOpt = usersRepository.findByUsernameAndEmail(username, email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok("인증 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("일치하지 않음");
        }
    }

    // 비밀번호 재설정
    @PostMapping("/public/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String newPassword = payload.get("newPassword");

        UsersEntity user = usersRepository.findByUsername(username);
        if(user != null) {
            user.setPassword(bCryptPasswordEncoder.encode(newPassword));
            usersRepository.save(user);
            return ResponseEntity.ok("변경 완료");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 없음");
        }

    }

}
