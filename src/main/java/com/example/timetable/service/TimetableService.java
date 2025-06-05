package com.example.timetable.service;

import com.example.classes.entity.ClassesEntity;
import com.example.classes.jpa.ClassUsersRepository;
import com.example.timetable.dto.TimecontentsDto;
import com.example.timetable.dto.TimetableRequestDto;
import com.example.timetable.entity.TimecontentsEntity;
import com.example.timetable.entity.TimetableEntity;
import com.example.timetable.entity.TimeusersEntity;
import com.example.timetable.repository.TimecontentsRepository;
import com.example.timetable.repository.TimetableRepository;
import com.example.timetable.repository.TimeusersRepository;
import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.StudentsEntity;
import com.example.user.jpa.AcademiesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TimetableService {
    private final TimetableRepository timetableRepository;
    private final TimecontentsRepository timecontentsRepository;
    private final TimeusersRepository timeusersRepository;
    private final ClassUsersRepository classUsersRepository;
    private final AcademiesRepository academiesRepository;

    @Transactional
    public void saveTimetable(TimetableRequestDto dto){

        AcademiesEntity academy = academiesRepository.getReferenceById(dto.getAcademyId());

        //timetable 저장
        TimetableEntity timeTemp = TimetableEntity.builder()
                .academy(academy)
                .title(dto.getTitle())
                .daySort(dto.getDaySort())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .build();


        final TimetableEntity timetable = timetableRepository.save(timeTemp);

        //Timecontents 저장 및 student Id 수집
        List<TimecontentsEntity> contentEntities=new ArrayList<>();
        Set<Integer> studentIds=new HashSet<>();

        for(TimecontentsDto contentDto : dto.getContentsDtoList()){
            ClassesEntity classesEntity =ClassesEntity.builder().classId(contentDto.getClassId()).build();

            TimecontentsEntity content=TimecontentsEntity.builder()
                    .timetable(timetable)
                    .startTime(contentDto.getStartTime().truncatedTo(ChronoUnit.MINUTES))
                    .endTime(contentDto.getEndTime().truncatedTo(ChronoUnit.MINUTES))
                    .classes(classesEntity)
                    .type(contentDto.getType())
                    .build();
            contentEntities.add(content);

            //수업에 속한 학생id 모으기
            List<Integer> classStudentIds=classUsersRepository.findStudentIdsByClassId(contentDto.getClassId());
            studentIds.addAll(classStudentIds);
        }
        timecontentsRepository.saveAll(contentEntities);

        //Timeusers 저장
        List<TimeusersEntity> timeusers=studentIds.stream()
                .map(studentId->TimeusersEntity.builder()
                        .student(StudentsEntity.builder().studentId(studentId).build())
                        .timetable(timetable)
                        .build())
                .toList();

        timeusersRepository.saveAll(timeusers);
    }

}
