package com.example.user.service;

import com.example.user.dto.TeacherDto;
import com.example.user.entity.TeachersEntity;
import com.example.user.jpa.TeachersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeachersService {
    private final TeachersRepository teachersRepository;


    /**
     * userId로 teachers 테이블에서 teacherId 검색 - 종합평가 페이지에서 필요
     */
    public int getTeacherIdByUserId(int userId) {
        TeachersEntity teacher = teachersRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("해당 userId의 강사가 존재하지 않습니다."));
        return teacher.getTeacherId();
    }

    /**
     * 역할에 따라 과목명 + 강사 이름을 DTO로 반환
     * - 강사: 본인의 과목 + 이름
     * - 관리자/원장: 전체 강사의 과목 + 이름
     */
    public List<TeacherDto> getSubjectsByRole(String role, int userId) {
        if (role.equals("강사")) {
            return teachersRepository.findTeacherDtosByUserId(userId);
        } else if (role.equals("관리자") || role.equals("원장")) {
            return teachersRepository.findAllTeacherDtos();
        } else {
            return Collections.emptyList();
        }
    }

    /**academyId에 해당하는 전체 선생님 목록 조회(users 테이블에서 name값도 같이 조회)
     * */
    public List<TeacherDto> getTeachersByAcaId(int acaId) {
        return teachersRepository.findTeachersByAcaId(acaId);
    }
}
