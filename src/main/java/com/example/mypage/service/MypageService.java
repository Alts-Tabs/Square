package com.example.mypage.service;

import com.example.mypage.dto.MypageInfoDto;
import com.example.mypage.dto.PasswordChangeDto;
import com.example.mypage.dto.WithdrawalDto;
import com.example.naver.storage.NcpObjectStorageService;
import com.example.user.entity.*;
import com.example.user.jpa.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MypageService {

    private final UsersRepository usersRepository;
    private final AcademiesRepository academiesRepository;
    private final ParentsRepository parentsRepository;
    private final StudentsRepository studentsRepository;
    private final TeachersRepository teachersRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final NcpObjectStorageService storageService;
    private String bucketName = "square";

    // 기본 정보 조회
    public MypageInfoDto getUserInfo(int userId) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("NOT FOUND USER"));

        MypageInfoDto dto = new MypageInfoDto(user);

        String roleEnum = user.getRole().name();
        String roleKey = roleEnum.replace("ROLE_", "");

        String role = switch (roleKey) {
            case "ADMIN" -> "관리자";
            case "DIRECTOR" -> "원장";
            case "PARENT" -> "학부모";
            case "TEACHER" -> "강사";
            case "STUDENT" -> "학생";
            default -> "비회원";
        };
        dto.setRole(role);

        // 원장 => 학원 이름
        if ("DIRECTOR".equals(roleKey)) {
            AcademiesEntity academy = academiesRepository.findByUser(user);
            dto.setAcademyName(academy != null ? academy.getAca_name() : null);
        }

        // 학부모 => 자녀 이름 리스트
        if ("PARENT".equals(roleKey)) {
            parentsRepository.findByUserUserId(userId).ifPresent(parent -> {
                List<StudentsEntity> children = studentsRepository.findByParentParentId(parent.getParentId());
                List<String> studentNames = children.stream()
                        .map(s -> s.getUser().getName())
                        .collect(Collectors.toList());
                dto.setStudents(studentNames);
            });
        }

        // 강사 => 담당 과목
        if ("TEACHER".equals(roleKey)) {
            teachersRepository.findByUserUserId(userId)
                    .ifPresent(teacher -> dto.setSubject(teacher.getSubject()));
        }

        // 학생 => 소속 클래스
        if ("STUDENT".equals(roleKey)) {
            StudentsEntity student = studentsRepository.findByUserId(userId);
            if (student != null && student.getClassUsers() != null && !student.getClassUsers().isEmpty()) {
                String classNames = student.getClassUsers().stream()
                        .map(cu -> cu.getClassEntity().getName())
                        .collect(Collectors.joining(", "));
                dto.setClassName(classNames);
            } else {
                dto.setClassName(null);
            }
        }

        return dto;
    }

    // 휴대폰 번호 변경 후 최신 정보 반환
    public MypageInfoDto updatePhone(int userId, String phone) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("NOT FOUND USER"));
        user.setPhone(phone);
        usersRepository.save(user);
        return getUserInfo(userId);
    }

    // 이메일 변경 후 최신 정보 반환
    public MypageInfoDto updateEmail(int userId, String email) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("NOT FOUND USER"));
        user.setEmail(email);
        usersRepository.save(user);
        return getUserInfo(userId);
    }

    // 프로필 변경 후 최신정보 반환
    public MypageInfoDto updateProfileImage(int userId, MultipartFile file) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("NOT FOUND USER"));

        // 이전 프로필 삭제
        if(user.getUserProfile() != null) {
            String fileName = user.getUserProfile();
            storageService.deleteFile(bucketName, "mypage", fileName);
        }

        String fileUrl = storageService.uploadFile(bucketName, "mypage", file);

        user.setUserProfile(fileUrl);
        usersRepository.save(user);

        return getUserInfo(userId);
    }


    // 비밀번호 변경
    public boolean changePassword(int userId, PasswordChangeDto dto) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("NOT FOUND USER"));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            return false;
        }

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("INVALID NEw PASSWORD");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        usersRepository.save(user);

        return true;
    }

    // 회원 탈퇴
    public boolean withdrawUser(int userId, WithdrawalDto dto) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("NOT FOUND USER"));

        if (passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            usersRepository.delete(user);
            return true;
        } else {
            return false;
        }
    }
}
