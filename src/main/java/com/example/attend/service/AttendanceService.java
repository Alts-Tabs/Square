package com.example.attend.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.example.attend.dto.StartAttendanceResponseDto;
import com.example.attend.entity.*;
import com.example.attend.repository.*;
import com.example.classes.jpa.ClassUsersRepository;
import com.example.timetable.entity.TimecontentsEntity;
import com.example.timetable.entity.TimetableEntity;
import com.example.timetable.entity.TimeusersEntity;
import com.example.timetable.repository.TimecontentsRepository;
import com.example.timetable.repository.TimeusersRepository;
import com.example.user.entity.StudentsEntity;
import com.example.user.entity.UserRole;
import com.example.user.entity.UsersEntity;
import com.example.user.jpa.StudentsRepository;
import com.example.user.jpa.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final UsersRepository usersRepository;
    private final TimecontentsRepository timecontentsRepository;
    private final TimeusersRepository timeusersRepository;
    private final ClassUsersRepository classUsersRepository;
    private final TimetableAttendRepository timetableAttendRepository;
    private final AttendanceCodeRepository attendanceCodeRepository;
    private final AttendancesRepository attendancesRepository;
    private final StudentsRepository studentsRepository;

    // 출석 시작: 출석코드 생성 + 출석부 초기화 =============================================================================
    @Transactional
    public StartAttendanceResponseDto startAttendance(Integer userId) {
        // 현재 수업 정보 가져오기 (기존 TimetableService 로직 활용)
        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        int today = now.getDayOfWeek().getValue() % 7; // 월=1 ~ 일=7(DB는 일(0) ~ 토(6))

        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저 없음"));

        // 강사의 현재 시간표 가져오기
        TimecontentsEntity currentClass = timecontentsRepository.findAll().stream()
                .filter(tc -> {
                    LocalTime startTime = tc.getStartTime().withSecond(0).withNano(0);
                    LocalTime endTime = tc.getEndTime().withSecond(0).withNano(0);

                    return tc.getDayOfWeek() == today &&
                            !now.toLocalTime().isBefore(startTime) &&
                            !now.toLocalTime().isAfter(endTime) &&
                            tc.getClasses() != null &&
                            tc.getClasses().getTeacher().getUser() == user;
                })
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("현재 수업이 없음"));
        TimetableEntity timetable = currentClass.getTimetable(); // 시간표

        // 1. TimetableAttend 생성
        TimetableAttendEntity timetableAttend = TimetableAttendEntity.builder()
                .timetable(timetable)
                .build();
        timetableAttend = timetableAttendRepository.save(timetableAttend); // 저장 후 영속성 코드 받기

        // 2. 출석 코드 생성 (세 자리)
        int code = (int) (Math.random() * 900 + 100);
        AttendanceCodeEntity codeEntity = AttendanceCodeEntity.builder()
                .code(code)
                .timetableAttend(timetableAttend)
                .build();
        attendanceCodeRepository.save(codeEntity);

        // 3. timetable_attend 등록
        // 3-1. 수업에 속한 학생 가져오기
        List<TimeusersEntity> timeUsers = timeusersRepository.findByTimetable_timetableId(timetable.getTimetableId());

        // 3-2. attendances 초기화 - 학생들 초기 정보 저장
        for (TimeusersEntity tu : timeUsers) {
            AttendancesEntity attendance = AttendancesEntity.builder()
                    .student(tu.getStudent())
                    .timetableAttend(timetableAttend)
                    .build();
            attendancesRepository.save(attendance);
        }

        // 응답
        return StartAttendanceResponseDto.builder()
                .idx(timetableAttend.getIdx())
                .code(code)
                .build();
    }


    // 출석 종료 ========================================================================================================
    @Transactional
    public void endAttendance(int timetableAttendIdx) {
        // 현재 출결에 대한 사항 가져오기
        TimetableAttendEntity timetableAttend = timetableAttendRepository.findById(timetableAttendIdx)
                .orElseThrow(() -> new NotFoundException("NOT FOUND TimetableAttend"));

        // 현재 출석에 대한 모든 출결 관련 가져오기 - 초기 정보
        List<AttendancesEntity> records = attendancesRepository.findAllByTimetableAttend(timetableAttend);

        attendancesRepository.saveAll(records); // 저장

        // 출석 코드 삭제
        AttendanceCodeEntity code = attendanceCodeRepository.findTopByTimetableAttend_IdxOrderByCreatedAtDesc(timetableAttendIdx);
        attendanceCodeRepository.delete(code);
    }


    // 출석 취소 ========================================================================================================
    @Transactional
    public void cancelAttendance(int timetableAttendIdx) {
        TimetableAttendEntity timetableAttend = timetableAttendRepository.findById(timetableAttendIdx)
                .orElseThrow(() -> new NotFoundException("NOT FOUND TimetableAttend"));

        // 출석 코드 삭제 (가장 최근 생성된 코드 기준)
        AttendanceCodeEntity code = attendanceCodeRepository.findTopByTimetableAttend_IdxOrderByCreatedAtDesc(timetableAttendIdx);
        if (code != null) {
            attendanceCodeRepository.delete(code);
        }

        timetableAttendRepository.delete(timetableAttend); // 출결 기록 삭제는 Cascade에 의해 자동으로 지워짐
    }


    // 학생 출석 입력란 활성화 여부 ========================================================================================
    @Transactional
    public boolean isAttendanceActive(Integer userId) {
        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        int today = now.getDayOfWeek().getValue() % 7;

        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("NOT FOUND USER"));

        // 현재 수업 시간대 찾기
        Optional<TimecontentsEntity> currentClassOpt = timecontentsRepository.findAll().stream()
                .filter(tc -> {
                    LocalTime start = tc.getStartTime().withSecond(0).withNano(0);
                    LocalTime end = tc.getEndTime().withSecond(0).withNano(0);

                    // 기본 요일 및 시간대 조건
                    boolean timeMatch = tc.getDayOfWeek() == today &&
                            !now.toLocalTime().isBefore(start) &&
                            !now.toLocalTime().isAfter(end) &&
                            tc.getClasses() != null;

                    if(!timeMatch) return false;


                    // 사용자 검증
                    return tc.getClasses().getClassUsers().stream()
                            .anyMatch(classUser -> classUser.getStudent().getUser().equals(user));

                }).findFirst();

        if (currentClassOpt.isEmpty()) return false;

        TimetableEntity timetable = currentClassOpt.get().getTimetable();

        // 가장 최근의 timetable_attend 가져오기
        Optional<TimetableAttendEntity> attendOpt = timetableAttendRepository.findTopByTimetableOrderByIdxDesc(timetable);
        if (attendOpt.isEmpty()) return false;

        TimetableAttendEntity attend = attendOpt.get();

        // 출석 코드 존재 여부 확인
        AttendanceCodeEntity code = attendanceCodeRepository
                .findTopByTimetableAttend_IdxOrderByCreatedAtDesc(attend.getIdx());

        return code != null;
    }


    // 학생 출석  =======================================================================================================
    @Transactional
    public boolean submitAttendanceCode(Integer userId, int submittedCode) {
        LocalDateTime now = LocalDateTime.now().withSecond(0).withNano(0);
        int today = now.getDayOfWeek().getValue() % 7;

        // 1. 학생 정보 확인
        StudentsEntity student = studentsRepository.findByUserId(userId);
        if (student == null) return false;

        // 2. 현재 수업 시간대 찾기
        Optional<TimecontentsEntity> currentClassOpt = timecontentsRepository.findAll().stream()
                .filter(tc -> {
                    LocalTime start = tc.getStartTime().withSecond(0).withNano(0);
                    LocalTime end = tc.getEndTime().withSecond(0).withNano(0);
                    boolean timeMatch = tc.getDayOfWeek() == today &&
                            !now.toLocalTime().isBefore(start) &&
                            !now.toLocalTime().isAfter(end) &&
                            tc.getClasses() != null;
                    if(!timeMatch) return false;

                    return tc.getClasses().getClassUsers().stream()
                            .anyMatch(classUser -> classUser.getStudent().equals(student));

                }).findFirst();
        if (currentClassOpt.isEmpty()) return false;

        TimetableEntity timetable = currentClassOpt.get().getTimetable();

        // 3. timetable_attend 찾기
        Optional<TimetableAttendEntity> attendOpt = timetableAttendRepository.findTopByTimetableOrderByIdxDesc(timetable);
        if (attendOpt.isEmpty()) return false;

        TimetableAttendEntity attend = attendOpt.get();

        // 4. 출석 코드 검증
        AttendanceCodeEntity code = attendanceCodeRepository
                .findTopByTimetableAttend_IdxOrderByCreatedAtDesc(attend.getIdx());

        System.out.println("submit requset: student=" + student.getUser().getName() + ", timetableAttendIdx=" + attend.getIdx());
        System.out.println("search code=" + (code != null ? code.getCode() : "null") + ", submitcode= "+ submittedCode);

        if (code == null || code.getCode() != submittedCode) return false;

        // 5. 출석 상태 갱신
        AttendancesEntity attendance = attendancesRepository.findByTimetableAttendAndStudent(attend, student);
        if (attendance == null) return false;

        attendance.setStatus(AttendancesEntity.Status.PRESENT);
        attendance.setVerified_at(now);
        attendancesRepository.save(attendance);

        return true;
    }

}