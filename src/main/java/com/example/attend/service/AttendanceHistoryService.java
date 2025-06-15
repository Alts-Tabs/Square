package com.example.attend.service;

import com.example.attend.dto.AttendanceHistoryDto;
import com.example.attend.entity.AttendancesEntity;
import com.example.attend.repository.AttendancesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceHistoryService {
    private final AttendancesRepository attendancesRepository;

    public List<AttendanceHistoryDto> getAllAttendanceSummary() {
        List<AttendancesEntity> all = attendancesRepository.findAll()
                .stream()
                .filter(a -> a.getVerified_at() != null)
                .collect(Collectors.toList());

        // 날짜 + 수업 ID 별 그룹핑
        Map<String, List<AttendancesEntity>> grouped = all.stream()
                .collect(Collectors.groupingBy(a -> {
                    LocalDate date = a.getVerified_at().toLocalDate();
                    int timetableId = a.getTimetableAttend().getTimetable().getTimetableId();
                    return date.toString() + "-" + timetableId;
                }));

        List<AttendanceHistoryDto> result = new ArrayList<>();

        for (Map.Entry<String, List<AttendancesEntity>> entry : grouped.entrySet()) {
            List<AttendancesEntity> list = entry.getValue();
            if (list.isEmpty()) continue;

            AttendancesEntity sample = list.get(0);
            LocalDate date = sample.getVerified_at().toLocalDate();
            int timetableId = sample.getTimetableAttend().getTimetable().getTimetableId();

            long present = list.stream().filter(a -> a.getStatus() == AttendancesEntity.Status.PRESENT).count();
            long late = list.stream().filter(a -> a.getStatus() == AttendancesEntity.Status.LATE).count();
            long absent = list.stream().filter(a -> a.getStatus() == AttendancesEntity.Status.ABSENT).count();

            String dateStr = date.format(DateTimeFormatter.ofPattern("yy.MM.dd"));
            String dayStr = date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.KOREAN);
            String dateOnly = dateStr + " " + dayStr;

            result.add(AttendanceHistoryDto.builder()
                    .dateOnly(dateOnly)
                    .present(present)
                    .late(late)
                    .absent(absent)
                    .timetableId(timetableId)
                    .build());
        }

        return result;
    }
}