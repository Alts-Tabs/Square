package com.example.mypage.controller;

import com.example.mypage.dto.EmailUpdateDto;
import com.example.mypage.dto.MypageInfoDto;
import com.example.mypage.dto.PasswordChangeDto;
import com.example.mypage.dto.WithdrawalDto;
import com.example.mypage.service.MypageService;
import com.example.security.CustomUserDetails;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MypageController {

    private final MypageService mypageService;

    // 기본 정보 조회
    @GetMapping("/info")
    public ResponseEntity<MypageInfoDto> getUserInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        MypageInfoDto info = mypageService.getUserInfo(userDetails.getUserId());
        return ResponseEntity.ok(info);
    }

    // 휴대폰 번호 변경
    @PutMapping("/phone")
    public ResponseEntity<MypageInfoDto> updatePhone(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                     @RequestBody PhoneUpdateDto dto) {
        MypageInfoDto updatedInfo = mypageService.updatePhone(userDetails.getUserId(), dto.getPhone());
        return ResponseEntity.ok(updatedInfo);
    }

    // 이메일 변경
    @PutMapping("/email")
    public ResponseEntity<MypageInfoDto> updateEmail(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                     @RequestBody EmailUpdateDto dto) {
        MypageInfoDto updatedInfo = mypageService.updateEmail(userDetails.getUserId(), dto.getEmail());
        return ResponseEntity.ok(updatedInfo);
    }


    // 비밀번호 변경
    @PutMapping("/password")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                 @RequestBody PasswordChangeDto dto) {
        try {
            boolean success = mypageService.changePassword(userDetails.getUserId(), dto);
            if (success) {
                return ResponseEntity.ok("비밀번호 변경 성공");
            } else {
                return ResponseEntity.badRequest().body("현재 비밀번호가 일치하지 않습니다.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 회원 탈퇴
    @DeleteMapping("/withdrawal")
    public ResponseEntity<String> withdrawUser(@AuthenticationPrincipal CustomUserDetails userDetails,
                                               @RequestBody WithdrawalDto dto) {
        boolean success = mypageService.withdrawUser(userDetails.getUserId(), dto);
        if (success) {
            return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("비밀번호가 일치하지 않습니다.");
        }
    }

    @Data
    public static class PhoneUpdateDto {
        private String phone;
    }
}
