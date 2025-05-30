package com.example.user.controller;

import com.example.user.dto.CodeDto;
import com.example.user.dto.SubJoinDto;
import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.CodeEntity;
import com.example.user.entity.ParentsEntity;
import com.example.user.entity.UsersEntity;
import com.example.user.jpa.AcademiesRepository;
import com.example.user.jpa.CodeRepository;
import com.example.user.jpa.ParentsRepository;
import com.example.user.jpa.UsersRepository;
import com.example.user.service.JoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class SubUserController {
    private final CodeRepository codeRepository;
    private final AcademiesRepository acaRepository;
    private final JoinService joinService;
    private final ParentsRepository parentsRepository;
    private final UsersRepository usersRepository;

    // 학원 코드 검증
    @PostMapping("/dir/inputCode")
    public ResponseEntity<Map<String, Object>> codeCheck(@RequestBody CodeDto dto) {
        Map<String, Object> data = new HashMap<>();

        UsersEntity user = usersRepository.findByUsername(dto.getUsername());
        AcademiesEntity aca = acaRepository.findByUser(user);

        if(aca == null || user == null) {
            data.put("message", "UserFail");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST) // 400
                    .body(data);
        }

        String code = dto.getCode();
        // 코드가 다르면 실패
        if(!code.equals(aca.getCode())) {
            data.put("message", "codeFail");
            return ResponseEntity.status(HttpStatus.NOT_FOUND) // 404
                    .body(data);
        }

        CodeEntity subCode = CodeEntity.builder()
                .academy(aca)
                .people(dto.getPeople())
                .subcode(dto.getSubcode())
                .role(dto.getRole())
                .status(true)
                .endday(dto.getEndday())
                .createdBy(user)
                .build();

        codeRepository.save(subCode);
        data.put("message", "success");
        return ResponseEntity.ok(data);
    }

    // 서브 코드 확인
    @GetMapping("/public/subCode")
    public ResponseEntity<Map<String, Object>> subCode(@RequestParam("subcode") String subcode) {
        Optional<CodeEntity> infoOpt = codeRepository.findBySubcode(subcode);
        Map<String, Object> data = new HashMap<>();

        if(subcode == null || subcode.trim().isEmpty()) { // 값이 제대로 전달 받지 못한 예외처리
            data.put("message", "Missing code");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(data);
        }

        if(infoOpt.isEmpty()) {
            data.put("message", "Invalid code");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(data);
        }
        CodeEntity info = infoOpt.get();

        // 유효성 탈락 코드
        if(!joinService.checkCode(info)) {
            data.put("message", "Invalid code");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(data);
        }

        data.put("role", info.getRole());
        data.put("academy_id", info.getAcademy().getAcademyId());
        data.put("username", joinService.generateUsernames(info));

        return ResponseEntity.ok(data);
    }

    // 서브계정 회원가입 (강사, 부모, 학생)
    @PostMapping("/public/subJoin")
    public ResponseEntity<String> subJoin(@RequestBody SubJoinDto dto) {
        joinService.subJoinProcess(dto);
        return ResponseEntity.ok("success");
    }

    // 학생용 계정 요청 - 코드 생성
    @PostMapping("/parent/code")
    public ResponseEntity<Map<String, Object>> code(@RequestParam("username") String username,
                                                    @RequestParam("people") int people) {
        Map<String, Object> data = new HashMap<>();
        UsersEntity user = usersRepository.findByUsername(username);
        if(user == null) {
            data.put("message", "Invalid username");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(data);
        }

        Optional<ParentsEntity> parentOpt = parentsRepository.findByUserWithAcademy(user);
        if(parentOpt.isEmpty()) {
            // 사용자가 부모가 아니면..
            data.put("message", "You are not Parent!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(data);
        }

        ParentsEntity parent = parentOpt.get();
        AcademiesEntity academy = parent.getAcademy();

        // 학생용 랜덤 코드 생성
        String stuCode = joinService.generateStuCode();
        CodeEntity stuSubCode = CodeEntity.builder()
                .academy(academy)
                .subcode(stuCode)
                .people(people)
                .role("ROLE_STUDENT")
                .status(true)
                .createdBy(user)
                .endday(LocalDateTime.now().plusWeeks(2)) // 현재 시각에서 2주까지 기한
                .build();

        codeRepository.save(stuSubCode);
        data.put("code", stuCode);

        return ResponseEntity.ok(data);
    }

}
