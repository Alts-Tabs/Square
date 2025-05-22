package com.example.data;

import lombok.Data;

@Data
public class SubJoinDto {
    private String username;
    private String password;
    private String name;
    private String phone;
    private String email;
    private String role;
    private int academy_id;

    private String subcode; // 서브 코드

    // 강사쪽 정보
    private String subject;

    // 학부모쪽 정보 - 필요한 게 생기면?
}
