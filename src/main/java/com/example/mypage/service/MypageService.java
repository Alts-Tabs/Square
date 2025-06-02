package com.example.mypage.service;

import com.example.mypage.dto.MypageInfoDto;
import com.example.mypage.dto.PasswordChangeDto;
import com.example.mypage.dto.WithdrawalDto;
import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.UsersEntity;
import com.example.user.jpa.AcademiesRepository;
import com.example.user.jpa.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MypageService {

    private final UsersRepository usersRepository;
    private final AcademiesRepository academiesRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // 기본 정보 조회
    public MypageInfoDto getUserInfo(int userId) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        AcademiesEntity academy = academiesRepository.findByUser(user);

        String role = switch (user.getRole().toString().substring(5)) {
            case "ADMIN" -> "관리자";
            case "DIRECTOR" -> "원장";
            case "PARENT" -> "학부모";
            case "TEACHER" -> "강사";
            case "STUDENT" -> "학생";
            default -> "비회원";
        };
        MypageInfoDto dto = new MypageInfoDto(user);
        dto.setRole(role);
        dto.setAcademyName(academy.getAca_name());

        return dto;
    }

    // 휴대폰 번호 변경
    public void updatePhone(int userId, String phone) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.setPhone(phone);
        usersRepository.save(user);
    }

    // 이메일 변경
    public void updateEmail(int userId, String email) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.setEmail(email);
        usersRepository.save(user);
    }

    // 비밀번호 변경
    public boolean changePassword(int userId, PasswordChangeDto dto) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
            usersRepository.save(user);
            return true;
        } else {
            return false;
        }
    }

    // 회원 탈퇴
    public boolean withdrawUser(int userId, WithdrawalDto dto) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            usersRepository.delete(user);
            return true;
        } else {
            return false;
        }
    }
}
