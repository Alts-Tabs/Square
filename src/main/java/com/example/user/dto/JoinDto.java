package com.example.user.dto;

import lombok.Data;

@Data
public class JoinDto {
    private String username;
    private String password;
    private String name;
    private String phone;
    private String email;
    private String aca_name;
    private String address;
    private String aca_prefix; // 접두사
    private String description;
//    private String role;
}
