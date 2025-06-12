package com.example.mypage.dto;

import com.example.user.entity.UsersEntity;
import lombok.Data;

import java.util.List;

@Data
public class MypageInfoDto {

    private String username;
    private String name;
    private String phone;
    private String email;
    private String role;
    private String userProfile;
    private String academyName;

    private List<String> students;
    private String subject;
    private String className;

    public MypageInfoDto(UsersEntity user) {
        this.username = user.getUsername();
        this.name = user.getName();
        this.phone = user.getPhone();
        this.email = user.getEmail();
        this.userProfile = user.getUserProfile();
        this.role = user.getRole().toString();
    }
}
