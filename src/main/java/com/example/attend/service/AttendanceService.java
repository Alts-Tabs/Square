package com.example.attend.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.example.attend.dto.AttendanceHistoryDto;
import com.example.attend.dto.StartAttendanceResponseDto;
import com.example.attend.entity.*;
import com.example.attend.repository.*;
import com.example.classes.entity.ClassUsersEntity;
import com.example.classes.jpa.ClassUsersRepository;
import com.example.timetable.entity.TimecontentsEntity;
import com.example.timetable.entity.TimetableEntity;
import com.example.timetable.entity.TimeusersEntity;
import com.example.timetable.repository.TimecontentsRepository;
import com.example.timetable.repository.TimeusersRepository;
import com.example.user.entity.UsersEntity;
import com.example.user.jpa.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

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
                            tc.getClasses().getTeacher().getUser().getUser_id() == userId;
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


    // 학생이 출석 코드를 입력하고 본인의 출석을 등록하는 메서드 ===============================================================
//    @Transactional
//    public void submitAttendance(int studentId, int idx, int inputCode) {
//        AttendanceCodeEntity codeEntity = attendanceCodeRepository.findByIdx(idx);
//
//        if (codeEntity == null) {
//            throw new IllegalArgumentException("출석 코드가 존재하지 않습니다.");
//        }
//
//        if (codeEntity.getCode() != inputCode) {
//            throw new IllegalArgumentException("출석 코드가 일치하지 않습니다.");
//        }
//
//        AttendancesEntity attendance = attendancesRepository.findByIdxAndStudent_StudentId(idx, studentId);
//        if (attendance == null) {
//            throw new IllegalArgumentException("해당 학생의 출석 정보가 없습니다.");
//        }
//
//        attendance.setStatus(AttendancesEntity.Status.PRESENT);
//        attendance.setVerified_at(LocalDateTime.now().withSecond(0).withNano(0));
//        attendancesRepository.save(attendance);
//    }


    // 특정 시간표(idx)의 출석부 리스트를 반환하는 메서드 ====================================================================
//    public AttendanceHistoryDto getAttendanceHistory(int codeIdx) {
//        AttendanceCodeEntity codeEntity = attendanceCodeRepository.findByIdx(codeIdx);
//        if (codeEntity == null) throw new IllegalArgumentException("출석 코드 없음");
//
//        TimetableAttendEntity timetable = timetableAttendRepository.findByAttendanceCode_Idx(codeIdx);
//        if (timetable == null) throw new IllegalArgumentException("해당 출석 기록 없음");
//
//        List<AttendancesEntity> records = attendancesRepository.findByTimetableAttend_Idx(timetable.getIdx());
//
//        int present = 0, late = 0, absent = 0;
//        List<AttendanceHistoryDto.StudentStatus> studentList = new ArrayList<>();
//
//        for (AttendancesEntity record : records) {
//            String status = record.getStatus().toString();
//            switch (status) {
//                case "PRESENT" -> present++;
//                case "LATE" -> late++;
//                case "ABSENT" -> absent++;
//            }
//
//            String studentName = record.getStudent().getUser().getName();
//
//            studentList.add(new AttendanceHistoryDto.StudentStatus(
//                    studentName,
//                    status
//            ));
//        }
//
//        String formattedDate = codeEntity.getCreated_at().format(
//                DateTimeFormatter.ofPattern("yy.MM.dd E요일", Locale.KOREAN)
//        ) + " 출석";
//
//        return new AttendanceHistoryDto(formattedDate, present, late, absent, studentList);
//    }
}
