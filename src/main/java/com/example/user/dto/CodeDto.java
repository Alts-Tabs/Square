package com.example.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CodeDto {
    private String subcode;
    private int people;
    private String role;
    private LocalDateTime endday;

    private String username;
    private String code;
}
