package com.example.schedule.service;

import com.example.schedule.dto.ScheduleResponse;
import com.example.schedule.dto.ScheduleSaveRequest;
import com.example.schedule.dto.SchoolsSimpleDto;
import com.example.schedule.entity.ScheduleEntity;
import com.example.schedule.entity.ScheduleType;
import com.example.schedule.entity.SchoolsEntity;
import com.example.schedule.entity.SchoolsScheduleEntity;
import com.example.schedule.jpa.ScheduleRepository;
import com.example.schedule.jpa.SchoolsRepository;
import com.example.schedule.jpa.SchoolsScheduleRepository;
import com.example.user.entity.AcademiesEntity;
import com.example.user.jpa.AcademiesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final AcademiesRepository academiesRepository;
    private final SchoolsRepository schoolsRepository;
    private final ScheduleRepository scheduleRepository;
    private final SchoolsScheduleRepository schoolsScheduleRepository;

    /**
     * 모든 학원 목록 출력
     * @return List SchoolsEntity
     */
    public List<SchoolsSimpleDto> getAllSchools() {
        List<SchoolsEntity> schools = schoolsRepository.findAll();
        return schools.stream()
                .map(s -> new SchoolsSimpleDto(s.getSchoolId(), s.getName()))
                .toList();
    }

    /**
     * 학원에 이미 등록된 스케줄에 해당하는 학교 리스트
     * @param academyId int
     * @return List SchoolsSimpleDto
     */
    public List<SchoolsSimpleDto> getSchoolsByAcademyId(int academyId) {
        List<SchoolsEntity> schools = schoolsScheduleRepository.findDistinctSchoolsByAcademyId(academyId);
        return schools.stream()
                .map(s -> new SchoolsSimpleDto(s.getSchoolId(), s.getName()))
                .toList();
    }

    /**
     * 학원 스케줄 일정 저장
     * @param dto ScheduleSaveRequest
     */
    @Transactional
    public void saveSchedule(ScheduleSaveRequest dto) {
        // 학원 식별
        AcademiesEntity academy = academiesRepository.findById(dto.getAcademyId())
                .orElseThrow(() -> new IllegalArgumentException("학원이 존재하지 않는다."));

        // 스케줄 저장
        ScheduleEntity schedule = ScheduleEntity.builder()
                .academy(academy)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .type(dto.getType())
                .color(dto.getColor())
                .build();
        scheduleRepository.save(schedule);

        // 학사 일정의 경우 매핑
        if(dto.getType() == ScheduleType.ACADEMIC) {
            if(dto.getSchoolId() == null) {
                throw new IllegalArgumentException("ACADEMIC NEEDs SchoolId");
            }

            SchoolsEntity school = schoolsRepository.findById(dto.getSchoolId())
                    .orElseThrow(() -> new IllegalArgumentException("School NOT FOUND"));

            SchoolsScheduleEntity link = SchoolsScheduleEntity.builder()
                    .school(school)
                    .schedule(schedule)
                    .build();
            schoolsScheduleRepository.save(link);
        }

    }

    /**
     * 학원 관련 일정 출력
     * @param academyId int
     * @return List ScheduleResponse
     */
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getAllSchedulesByAcademyId(int academyId) {
        List<ScheduleEntity> schedules = scheduleRepository.findByAcademy_AcademyId(academyId);

        return schedules.stream().map(schedule -> {
            ScheduleResponse.ScheduleResponseBuilder dtoBuilder = ScheduleResponse.builder()
                    .scheduleId(schedule.getScheduleId())
                    .title(schedule.getTitle())
                    .description(schedule.getDescription())
                    .startDate(schedule.getStartDate())
                    .endDate(schedule.getEndDate())
                    .color(schedule.getColor())
                    .type(schedule.getType());

            // 학사일정 추가정보
            if(schedule.getType() == ScheduleType.ACADEMIC) {
                SchoolsScheduleEntity link = schoolsScheduleRepository.findBySchedule(schedule).orElse(null);

                if(link != null) {
                    dtoBuilder.schoolId(link.getSchool().getSchoolId())
                            .schoolName(link.getSchool().getName());
                }
            }

            return dtoBuilder.build();
        }).toList();
    }

}
