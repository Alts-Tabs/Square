package com.example.controller;

import com.example.data.JoinDto;
import com.example.jwt.JwtUtil;
import com.example.repository.JoinService;
import com.example.repository.LoginService;
import com.example.repository.UsersRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public String idCheck(@RequestParam("username") String username) {
        Boolean isExist = usersRepository.existsByUsername(username);
        if(isExist) {
            System.out.println("존재하는 아이디");
            return "fail";
        }

        return "success";
    }

    // 원장 계정 회원가입
    @PostMapping("/public/join")
    public String join(@RequestBody JoinDto dto) {
        String roles = "ROLE_DIRECTOR"; // 원장 계정

        joinService.joinProcess(dto, roles);
        joinService.academyProcess(dto.getAca_name(), dto.getAddress(), dto.getDescription()); // 학원 정보 등록
        return "success";
    }

    // 로그인 기능 - 닉네임(성함), 아이디, 역할 얻기
    @GetMapping("/public/login")
    public Map<String, String> login(@RequestParam("username") String username, @RequestParam("password") String password) {
        String token = loginService.login(username, password);
        Map<String, String> data = new HashMap<>();

        // 사용자 이름 및 권한 같이 보내기
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

        data.put("token", token);
        data.put("username", username);
        data.put("name", name);
        data.put("role", role);
        data.put("Authorization", "Bearer "+token);

        return data;
    }

    // 로그인 정보 얻기
    @GetMapping("/public/user")
    public ResponseEntity<Map<String, Object>> user(HttpServletRequest request) {

        String auth = request.getHeader("Authorization");
        String token = auth.substring(7);

        String name = jwtUtil.getName(token);
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        Map<String, Object> data = new HashMap<>();
        data.put("message", "Info OK!");
        data.put("name", name);
        data.put("username", username);
        data.put("role", role);

        return ResponseEntity.ok(data);
    }


}
