package com.example.mypage.dto;

import com.example.user.entity.UsersEntity;
import lombok.Data;

@Data
public class MypageInfoDto {

    private String username;
    private String name;
    private String phone;
    private String email;
    private String role;
    private String academyName;

    public MypageInfoDto(UsersEntity user) {
        this.username = user.getUsername();
        this.name = user.getName();
        this.phone = user.getPhone();
        this.email = user.getEmail();
        this.role = user.getRole().toString();
    }
}
