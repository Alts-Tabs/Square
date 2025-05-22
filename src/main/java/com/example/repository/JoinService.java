package com.example.repository;

import com.example.data.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class JoinService {
    private final UsersRepository usersRepository;
    private final AcademiesRepository acaRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final TeachersRepository teachersRepository;
    private final ParentsRepository parentsRepository;
    private final CodeRepository codeRepository;

    /**
     * 회원가입 프로세스
     * @param dto JoinDto
     * @param roles String
     */
    public void joinProcess(JoinDto dto, String roles) {
        UsersEntity user = UsersEntity.builder()
                .username(dto.getUsername())
                .password(bCryptPasswordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .role(conversionTypeRole(roles))
                .build();

        usersRepository.save(user);
    }

    /**
     * 학원 정보 등록 프로세스
     * @param aca_name String
     * @param address String
     * @param description String
     * @param username String
     */
    public void academyProcess(String aca_name, String address, String description, String username) {
        String code = generateUniqueCode();

        AcademiesEntity aca = AcademiesEntity.builder()
                .aca_name(aca_name)
                .address(address)
                .description(description)
                .code(code)
                .username(username)
                .build();

        acaRepository.save(aca);
    }

    /**
     * 서브코드 유효성 검사 및 조정(삭제) <br/>
     * 유효성 통과: true
     * @param code CodeEntity
     * @return Boolean
     */
    public Boolean checkCode(CodeEntity code) {
        if(code == null) {
            return false;
        }

        if(code.getEndday() != null && code.getEndday().isBefore(LocalDateTime.now())) {
            code.setStatus(false);
        }

        if(!code.getStatus()) {
            // 사용 불가 코드 삭제
            codeRepository.delete(code);
            return false;
        }

        return true;
    }

    /**
     * 서브 계정(강사 & 부모) 회원가입 프로세스
     * @param dto SubJoinDto
     */
    public void subJoinProcess(SubJoinDto dto) {
        String roles = dto.getRole();

        UsersEntity uploadUser = UsersEntity.builder()
                .username(dto.getUsername())
                .password(bCryptPasswordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .role(conversionTypeRole(roles))
                .build();
        usersRepository.save(uploadUser);

        UsersEntity user = usersRepository.findByUsername(dto.getUsername());
        AcademiesEntity aca = acaRepository.getReferenceById(dto.getAcademy_id());

        CodeEntity code = codeRepository.findBySubcode(dto.getSubcode());

        if(roles.equals("ROLE_TEACHER")) {
            TeachersEntity teacher = TeachersEntity.builder()
                    .user(user)
                    .academy(aca)
                    .subject(dto.getSubject())
                    .build();

            teachersRepository.save(teacher);

            // 코드 상태 갱신
            codeStatus(code);
        }

        if(roles.equals("ROLE_PARENT")) {
            ParentsEntity parent = ParentsEntity.builder()
                    .user(user)
                    .academy(aca)
                    .build();

            parentsRepository.save(parent);
            // 코드 상태 갱신
            codeStatus(code);
        }
    }

    // 유저 권한 타입 변환
    private UserRole conversionTypeRole(String roles) {
        UserRole role;
        try {
            role = UserRole.valueOf(roles.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException("Invalid Role Value!" + roles);
        }

        return role;
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

    // 서브 코드 상태 관리
    private void codeStatus(CodeEntity code) {
        if(code == null) {
            return;
        }

        // 사용 코드 인원 수 감소
        int updatePeople = code.getPeople() - 1;
        code.setPeople(updatePeople);

        // 인원수가 0이 되면 status(사용 여부) false
        if(updatePeople <= 0) {
            code.setStatus(false);
        }

        codeRepository.save(code);
    }

}
