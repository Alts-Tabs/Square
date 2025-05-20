package com.example.repository;

import com.example.data.AcademiesEntity;
import com.example.data.JoinDto;
import com.example.data.UserRole;
import com.example.data.UsersEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JoinService {
    private final UsersRepository usersRepository;
    private final AcademiesRepository acaRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final CodeRepository codeRepository;

    /**
     * 회원가입 프로세스
     * @param dto JoinDto
     * @param roles String
     */
    public void joinProcess(JoinDto dto, String roles) {
        UserRole role;

        try {
            role = UserRole.valueOf(roles.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException("Invalid Role Value!" + roles);
        }

        UsersEntity user = UsersEntity.builder()
                .username(dto.getUsername())
                .password(bCryptPasswordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .role(role)
                .build();

        usersRepository.save(user);
    }

    /**
     * 학원 정보 등록 프로세스
     * @param aca_name String
     * @param address String
     * @param description String
     */
    public void academyProcess(String aca_name, String address, String description) {
        String code = generateUniqueCode();

        AcademiesEntity aca = AcademiesEntity.builder()
                .aca_name(aca_name)
                .address(address)
                .description(description)
                .code(code)
                .build();

        acaRepository.save(aca);
    }

    // 랜덤 코드 생성
    private String generateUniqueCode() {
        String code;
        int maxRetry = 10; // 무한루프 방지
        int attempts = 0;

        do {
            code = CodeUtil.generateAcademyCode(6);
            attempts++;
            if(attempts > maxRetry) {
                throw new IllegalStateException("중복되지 않는 학원 코드를 생성할 수 없습니다.");
            }
        } while(acaRepository.findByCode(code).isPresent());

        return code;
    }

}
