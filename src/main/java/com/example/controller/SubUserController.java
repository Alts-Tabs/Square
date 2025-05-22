package com.example.controller;

import com.example.data.AcademiesEntity;
import com.example.data.CodeDto;
import com.example.data.CodeEntity;
import com.example.data.SubJoinDto;
import com.example.repository.AcademiesRepository;
import com.example.repository.CodeRepository;
import com.example.repository.JoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class SubUserController {
    private final CodeRepository codeRepository;
    private final AcademiesRepository acaRepository;
    private final JoinService joinService;

    // 학원 코드 검증
    @PostMapping("/dir/inputCode")
    public String codeCheck(@RequestBody CodeDto dto) {
        AcademiesEntity aca = acaRepository.findByUsername(dto.getUsername());
        if(aca == null) {
            return "UserFail";
        }

        String code = dto.getCode();
        // 코드가 다르면 실패
        if(!code.equals(aca.getCode())) {
            return "codeFail";
        }

        CodeEntity subCode = CodeEntity.builder()
                .academy(aca)
                .people(dto.getPeople())
                .subcode(dto.getSubcode())
                .role(dto.getRole())
                .status(true)
                .endday(dto.getEndday())
                .build();

        codeRepository.save(subCode);

        return "success";
    }

    // 서브 코드 확인
    @GetMapping("/public/subCode")
    public ResponseEntity<Map<String, Object>> subCode(@RequestParam("subcode") String subcode) {
        CodeEntity info = codeRepository.findBySubcode(subcode);
        Map<String, Object> data = new HashMap<>();

        if(info == null) {
            data.put("message", "Invalid code");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(data);
        }

        // 유효성 탈락 코드
        if(!joinService.checkCode(info)) {
            data.put("message", "Invalid code");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(data);
        }

        data.put("role", info.getRole());
        data.put("academy_id", info.getAcademy().getAcademy_id());

        return ResponseEntity.ok(data);
    }

    // 서브계정 회원가입 (강사, 부모)
    @PostMapping("/public/subJoin")
    public ResponseEntity<String> subJoin(@RequestBody SubJoinDto dto) {
        joinService.subJoinProcess(dto);
        return ResponseEntity.ok("success");
    }

}
