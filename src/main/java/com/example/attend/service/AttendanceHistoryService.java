package com.example.attend.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.example.attend.dto.*;
import com.example.attend.entity.AttendancesEntity;
import com.example.attend.entity.TimetableAttendEntity;
import com.example.attend.repository.AttendancesRepository;
import com.example.attend.repository.TimetableAttendRepository;
import com.example.timetable.entity.TimetableEntity;
import com.example.timetable.repository.TimetableRepository;
import com.example.user.entity.StudentsEntity;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceHistoryService {
    private final TimetableRepository timetableRepository;
    private final AttendancesRepository attendancesRepository;
    private final TimetableAttendRepository timetableAttendRepository;

    // 출석 기록 상세 조회 (AttendHistory.js) =============================================================================
    @Transactional(readOnly = true)
    public List<AttendanceHistoryDto> getAttendanceHistory(int timetableAttendIdx) {
        // attendances 테이블에서 timetable_attend_id == timetableAttend.idx인 모든 출석 기록들 가져오기
        TimetableAttendEntity timetableAttend = timetableAttendRepository.findById(timetableAttendIdx)
                .orElseThrow(() -> new NotFoundException("해당 출석 기록이 존재하지 않습니다."));

        List<AttendancesEntity> attendanceList = attendancesRepository.findAllByTimetableAttend(timetableAttend);

        return attendanceList.stream().map(att -> {
            StudentsEntity student = att.getStudent();
            String studentName = student.getUser().getName();  // UsersEntity에서 이름 꺼냄

            return AttendanceHistoryDto.builder()
                    .attendanceId(att.getAttendancesId())
                    .studentName(studentName)
                    .status(att.getStatus().name())
                    .memo(att.getMemo())
                    .verifiedAt(att.getVerified_at())
                    .build();
        }).collect(Collectors.toList());
    }


    // 출석 기록 상세 & 메모 수정 (AttendHistory.js) ======================================================================
    @Transactional
    public void updateAttendanceHistory(AttendanceHistoryUpdateDto updates) {
        AttendancesEntity attendance = attendancesRepository.findById(updates.getAttendanceId())
                .orElseThrow(() -> new NotFoundException("기록 없음"));

        AttendancesEntity.Status status;
        try {
            status = AttendancesEntity.Status.valueOf(updates.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid Status value");
        }

        attendance.setStatus(status);
        attendance.setMemo(updates.getMemo());
        attendance.setVerified_at(LocalDateTime.now());
    }


    // 지난 출석 전체 출력 (Attend.js) ====================================================================================
    @Transactional(readOnly = true)
    public List<AttendanceSummaryDto> getAttendanceSummary(int timetableId) {
        // timetableId로 timetable_attend 전부 조회
        List<TimetableAttendEntity> attendEntities =
                timetableAttendRepository.findByTimetable_TimetableIdOrderByAttendStartDesc(timetableId);

        //List<ClassesEntity> classesEntities =

        List<AttendanceSummaryDto> summaryList = new ArrayList<>();

        for (TimetableAttendEntity timetableAttend : attendEntities) {
            List<AttendancesEntity> attendanceList =
                    attendancesRepository.findAllByTimetableAttend(timetableAttend);

            // 각 상태별 count 계산
            long presentCount = attendanceList.stream()
                    .filter(att -> att.getStatus() == AttendancesEntity.Status.PRESENT)
                    .count();

            long absentCount = attendanceList.stream()
                    .filter(att -> att.getStatus() == AttendancesEntity.Status.ABSENT)
                    .count();

            long lateCount = attendanceList.stream()
                    .filter(att -> att.getStatus() == AttendancesEntity.Status.LATE)
                    .count();

            // 각 상태별로 DTO 따로 생성
            if (presentCount > 0) {
                summaryList.add(AttendanceSummaryDto.builder()
                        .timetableAttendId(timetableAttend.getIdx())
                        .attendStart(timetableAttend.getAttendStart())
                        .status("PRESENT")
                        .count((int) presentCount)
                        .build());
            }

            if (absentCount > 0) {
                summaryList.add(AttendanceSummaryDto.builder()
                        .timetableAttendId(timetableAttend.getIdx())
                        .attendStart(timetableAttend.getAttendStart())
                        .status("ABSENT")
                        .count((int) absentCount)
                        .build());
            }

            if (lateCount > 0) {
                summaryList.add(AttendanceSummaryDto.builder()
                        .timetableAttendId(timetableAttend.getIdx())
                        .attendStart(timetableAttend.getAttendStart())
                        .status("LATE")
                        .count((int) lateCount)
                        .build());
            }
        }

        return summaryList;
    }

    // 출석왕과 분발왕 출력
    public AttendanceRankingDto getMonthlyRanking(int timetableId) {
        TimetableEntity timetable = timetableRepository.findById(timetableId)
                .orElseThrow(() -> new NotFoundException("시간표를 찾을 수 없습니다."));

        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(23, 59, 59);

        Map<Integer, Integer> presentMap = new HashMap<>();
        Map<Integer, Integer> lateMap = new HashMap<>();
        Map<Integer, Integer> absentAdjustedMap = new HashMap<>();
        Map<Integer, StudentsEntity> studentMap = new HashMap<>();

        for(TimetableAttendEntity attend : timetable.getTimetableAttendList()) {
            LocalDateTime attendDate = attend.getAttendStart();
            if(attendDate == null || attendDate.isBefore(startOfMonth) || attendDate.isAfter(endOfMonth)) {
                continue;
            }

            for(AttendancesEntity attendance : attend.getAttendances()) {
                StudentsEntity student = attendance.getStudent();
                int studentId = student.getStudentId();

                studentMap.putIfAbsent(studentId, student); // 이후 name 조회용

                switch (attendance.getStatus()) {
                    case PRESENT:
                        presentMap.put(studentId, presentMap.getOrDefault(studentId, 0) + 1);
                        break;
                    case ABSENT:
                        absentAdjustedMap.put(studentId, absentAdjustedMap.getOrDefault(studentId, 0) + 1);
                        break;
                    case LATE:
                        lateMap.put(studentId, lateMap.getOrDefault(studentId, 0) + 1);
                        break;
                }
            }
        }

        // 지각 3회당 결석 1회
        for(Map.Entry<Integer, Integer> entry : lateMap.entrySet()) {
            int studentId = entry.getKey();
            int lateCount = entry.getValue();
            int convertedAbsents = lateCount / 3;

            absentAdjustedMap.put(studentId, absentAdjustedMap.getOrDefault(studentId, 0) + convertedAbsents);
        }

        StudentSummaryDto attendanceKing = presentMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(entry -> {
                    StudentsEntity student = studentMap.get(entry.getKey());
                    return new StudentSummaryDto(student.getStudentId(), student.getUser().getName(), entry.getValue());
                })
                .orElse(null);

        StudentSummaryDto needEffortKing = absentAdjustedMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(entry -> {
                    StudentsEntity student = studentMap.get(entry.getKey());
                    return new StudentSummaryDto(student.getStudentId(), student.getUser().getName(), entry.getValue());
                })
                .orElse(null);

        return new AttendanceRankingDto(attendanceKing, needEffortKing);
    }

}