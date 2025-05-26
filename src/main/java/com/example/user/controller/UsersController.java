package com.example.user.controller;

import com.example.security.CustomUserDetails;
import com.example.user.dto.JoinDto;
import com.example.jwt.JwtUtil;
import com.example.user.service.JoinService;
import com.example.user.service.LoginService;
import com.example.user.jpa.UsersRepository;
import jakarta.servlet.http.Cookie;
//import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class UsersController {
    private final JoinService joinService;
    private final UsersRepository usersRepository;
    private final LoginService loginService;
    private final JwtUtil jwtUtil;

    // ID Check
    @GetMapping("/public/idCheck")
    public ResponseEntity<?> idCheck(@RequestParam("username") String username) {
        boolean exists = usersRepository.existsByUsername(username);

        if(exists) {
//            System.out.println("존재하는 아이디");
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Exist ID", "available", false));
        }

        return ResponseEntity.ok(Map.of("message", "ID OK", "available", true));
    }

    // 원장 계정 회원가입
    @PostMapping("/public/join")
    public ResponseEntity<?> join(@RequestBody JoinDto dto) {
        String roles = "ROLE_DIRECTOR"; // 원장 계정

        joinService.joinProcess(dto, roles);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Join Success"));
    }

    // 로그인 기능 - 닉네임(성함), 아이디, 역할 얻기
    // 쿠키 형식으로 보내기
    @GetMapping("/public/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam("username") String username, @RequestParam("password") String password,
                                     HttpServletResponse response) {
        String token = loginService.login(username, password);
        if(token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 쿠키 생성 - Secure 설정 - HTTPS를 사용하지 않으므로 false
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false) // HTTPS 배포할 때 true
                .sameSite("Lax")
                .path("/")
                .maxAge(60 * 60 * 24) // 1일
                .build();

        response.setHeader("Set-Cookie", cookie.toString());

        // 사용자 이름 및 권한 보내기
        String name = jwtUtil.getName(token);
        String ROLE_role = jwtUtil.getRole(token).substring(5);
        String role = switch (ROLE_role) {
            case "ADMIN" -> "관리자";
            case "DIRECTOR" -> "원장";
            case "PARENT" -> "학부모";
            case "TEACHER" -> "강사";
            case "STUDENT" -> "학생";
            default -> "비회원";
        };

        Map<String, String> data = new HashMap<>();
//        data.put("token", token);
        data.put("username", username);
        data.put("name", name);
        data.put("role", role);
//        data.put("Authorization", "Bearer "+token);

        return ResponseEntity.ok(data);
    }

    // 로그인 정보 얻기 - 쿠키에서 토큰 추출
    @GetMapping("/public/user")
    public ResponseEntity<?> user(Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Request Login");
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String role = switch (userDetails.getRole().substring(5)) {
            case "ADMIN" -> "관리자";
            case "DIRECTOR" -> "원장";
            case "PARENT" -> "학부모";
            case "TEACHER" -> "강사";
            case "STUDENT" -> "학생";
            default -> "비회원";
        };

        Map<String, Object> data = new HashMap<>();
        data.put("message", "Info OK!");
        data.put("name", userDetails.getName());
        data.put("username", userDetails.getUsername());
        data.put("role", role);

        return ResponseEntity.ok(data);
    }

    // 로그아웃
    @PostMapping("/public/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // 토큰 쿠키 삭제
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 쿠키 만료
        response.addCookie(cookie);
        return ResponseEntity.ok("Logout success");
    }
}
