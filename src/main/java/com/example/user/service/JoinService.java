package com.example.user.service;

import com.example.user.dto.JoinDto;
import com.example.user.dto.SubJoinDto;
import com.example.user.entity.*;
import com.example.user.jpa.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JoinService {
    private final UsersRepository usersRepository;
    private final AcademiesRepository acaRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final TeachersRepository teachersRepository;
    private final ParentsRepository parentsRepository;
    private final CodeRepository codeRepository;
    private final StudentsRepository stuRepository;

    /**
     * 원장계정 회원가입 프로세스 - 유저 정보 & 학원
     * @param dto JoinDto
     * @param roles String
     */
    @Transactional
    public void joinProcess(JoinDto dto, String roles) {
        UsersEntity user = UsersEntity.builder()
                .username(dto.getUsername())
                .password(bCryptPasswordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .role(conversionTypeRole(roles))
                .build();

        UsersEntity newUser = usersRepository.save(user);

        // 학원 정보 등록
        String code = generateUniqueCode();

        String description = dto.getDescription();
        String prefix = generateAcaPrefix(dto.getAca_prefix());

        AcademiesEntity aca = AcademiesEntity.builder()
                .aca_name(dto.getAca_name())
                .user(newUser)
                .address(dto.getAddress())
                .aca_prefix(prefix)
                .description(description)
                .code(code)
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
     * 서브 계정(강사 & 부모 & 학생) 회원가입 프로세스
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

        Optional<CodeEntity> codeOpt = codeRepository.findBySubcode(dto.getSubcode());
        if(codeOpt.isEmpty()) { // 서브 코드가 빈 경우 다시 삭제
            usersRepository.delete(user);
        }

        CodeEntity code = codeOpt.get();

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

        if(roles.equals("ROLE_STUDENT")) {
            UsersEntity createdUser = code.getCreatedBy(); // 코드 생성자 얻기
            Optional<ParentsEntity> parentOpt = parentsRepository.findByUserWithAcademy(createdUser);

            if(parentOpt.isEmpty()) {
                usersRepository.delete(user);
                return;
            }
            ParentsEntity par = parentOpt.get();

            StudentsEntity students = StudentsEntity.builder()
                    .user(user)
                    .parent(par)
                    .academy(aca)
                    .build();

            stuRepository.save(students);

            codeStatus(code);
        }

    }

    /**
     * 서브코드에 따른 아이디 생성(학원접두사-권한-숫자)
     * @param info CodeEntity
     * @return username String
     */
    public String generateUsernames(CodeEntity info) {
        // info를 토대로 연관된 학원 정보(AcademiesEntity) 가져오기
        AcademiesEntity aca = info.getAcademy();

        // 접두사를 추출 이후 info의 권한에 따라 '-권한-' 붙이기
        String acaPrefix = aca.getAca_prefix();
        String role = switch (info.getRole()) {
            case "ROLE_TEACHER" -> "tea";
            case "ROLE_PARENT" -> "par";
            case "ROLE_STUDENT" -> "stu";
            default -> throw new IllegalArgumentException("지원하지 않는 권한입니다: " + info.getRole());
        };

        // 이후 생성된 username 반환
        String prefix = acaPrefix + "-" + role + "-";
        return parsingUserPrefix(prefix);
    }

    /**
     * 7자리 랜덤 서브 코드 생성
     * @return stuCode
     */
    public String generateStuCode() {
        String stuCode;
        int maxRetry = 10; // 무한루프 방지
        int attempts = 0;

        do {
            stuCode = CodeUtil.generateAcademyCode(7);
            attempts++;
            if(attempts > maxRetry) {
                throw new IllegalStateException("중복되지 않는 학원 코드를 생성할 수 없습니다.");
            }
        } while(codeRepository.findBySubcode(stuCode).isPresent());

        return stuCode;
    }

    // 계정 아이디 설정
    private String parsingUserPrefix(String prefix) {
        // UsersEntity 에서 해당 접두사로 시작하는 아이디 리스트 가져오기
        List<String> existingUsernames = usersRepository.findUsernamesStartingWith(prefix);

        // 무조건 마지막으로 끝난 숫자보다 1 많게 username에 붙이기
        int max = 0;
        for(String username : existingUsernames) {
            try {
                String numberPart = username.substring(prefix.length());
                int num = Integer.parseInt(numberPart);
                if (num > max) {
                    max = num;
                }
            } catch (NumberFormatException | IndexOutOfBoundsException e) {
                // 예외 처리
            }
        }

        return prefix + (max + 1);
    }


    // 학원 접두사 설정
    private String generateAcaPrefix(String basePrefix) {
        // basePrefix(bit) 입력하면 bit1 출력
        List<String> existingPrefixes = acaRepository.findAllByPrefix(basePrefix);

        int max = -1;
        for(String prefix : existingPrefixes) {
            try {
                String numPart = prefix.substring(basePrefix.length()); // 접두사 부분만 제거
                int idx = Integer.parseInt(numPart);
                if(idx > max) {
                    max = idx;
                }
            } catch (NumberFormatException | IndexOutOfBoundsException e) {
                // 예외 처리
            }
        }

        // 최댓값 보다 큰 다음 접두사 출력
        return basePrefix + (max + 1);
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
