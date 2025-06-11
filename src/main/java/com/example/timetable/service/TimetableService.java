package com.example.timetable.service;

import com.example.classes.entity.ClassesEntity;
import com.example.classes.jpa.ClassUsersRepository;
import com.example.timetable.dto.*;
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

import java.time.DayOfWeek;
import static java.time.DayOfWeek.*;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimetableService {
    private final TimetableRepository timetableRepository;
    private final TimecontentsRepository timecontentsRepository;
    private final TimeusersRepository timeusersRepository;
    private final ClassUsersRepository classUsersRepository;
    private final AcademiesRepository academiesRepository;

    /**시간표 등록
     * timetable > timecontents > timeusers 순으로 등록*/
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

            TimecontentsEntity.TimecontentsEntityBuilder builder = TimecontentsEntity.builder()
                    .timetable(timetable)
                    .startTime(contentDto.getStartTime().truncatedTo(ChronoUnit.MINUTES))
                    .endTime(contentDto.getEndTime().truncatedTo(ChronoUnit.MINUTES))
                    .type(contentDto.getType())
                    .dayOfWeek(contentDto.getDayOfWeek())
                    .description(contentDto.getDescription());


            // classId가 있는 경우만 클래스 설정
            if (contentDto.getClassId() != null) {
                builder.classes(ClassesEntity.builder().classId(contentDto.getClassId()).build());

                // 수업에 속한 학생 ID 모으기
                List<Integer> classStudentIds = classUsersRepository.findStudentIdsByClassId(contentDto.getClassId());
                studentIds.addAll(classStudentIds);
            }
            // 최종 엔티티 빌드 및 리스트에 추가
            TimecontentsEntity content = builder.build();
            contentEntities.add(content);
        }
        // Timecontents 저장
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

    /**시간표 조회 - academyId 기준*/
    public List<TimetableDto> getByAcademyID(int academyId){
        return timetableRepository.findByAcademy_AcademyId(academyId)
                .stream()
                .map(t -> TimetableDto.builder()
                        .timetableId(t.getTimetableId())
                        .title(t.getTitle())
                        .daySort(t.getDaySort())
                        .startDate(t.getStartDate())
                        .endDate(t.getEndDate())
                        .build())
                .collect(Collectors.toList());
    }


    /**시간표 상세 조회 - daySort 필터는 프론트에 처리 예정  */
    public List<TimecontentsDto> getContentsByTimetableId(int timetableId){
        return timecontentsRepository.findByTimetable_TimetableId(timetableId)
                .stream()
                .map(c->{
                    Integer classId = c.getClasses() != null ? c.getClasses().getClassId() : null;
                    String className = c.getClasses() != null ? c.getClasses().getName() : null;

                    return TimecontentsDto.builder()
                            .startTime(c.getStartTime())
                            .endTime(c.getEndTime())
                            .classId(classId)
                            .className(className)
                            .type(c.getType())
                            .dayOfWeek(c.getDayOfWeek())
                            .description(c.getDescription())
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    /** 시간표 편집 페이지에 노출시킬 정보들*/
    public TimetableResponseDto getTimetableDetail(int timetableId){
        TimetableEntity timetable=timetableRepository.findById(timetableId).
                orElseThrow(()->new IllegalArgumentException("해당 시간표가 존재하지 않습니다. ID: "+timetableId));
        List<TimecontentsEntity> contents = timecontentsRepository.findByTimetable_TimetableId(timetableId);
        List<TimeusersEntity> users = timeusersRepository.findByTimetable_timetableId(timetableId);

        List<TimecontentsDto> contentsDtoList=contents.stream()
                .map(entity->{
                    ClassesEntity classes = entity.getClasses();//null 가능
                    return TimecontentsDto.builder()
                            .startTime(entity.getStartTime())
                            .endTime(entity.getEndTime())
                            .classId(classes != null ? classes.getClassId() : null)
                            .className(classes != null ? classes.getName() : null)
                            .dayOfWeek(entity.getDayOfWeek())
                            .type(entity.getType())
                            .description(entity.getDescription())
                            .build();
                })
                .collect(Collectors.toList());

        List<TimeusersDto> usersDtoList=users.stream()
                .map(entity->TimeusersDto.builder()
                        .studentId(entity.getStudent().getStudentId())
                        .studentName(entity.getStudent().getUser().getName())
                        .className(entity.getClass().getName())
                        .build())
                .collect(Collectors.toList());

        return TimetableResponseDto.builder()
                .timetableId(timetable.getTimetableId())
                .title(timetable.getTitle())
                .daySort(timetable.getDaySort())
                .startDate(timetable.getStartDate())
                .endDate(timetable.getEndDate())
                .contents(contentsDtoList)
                .users(usersDtoList)
                .dayList(convertDaySortToDayList(timetable.getDaySort()))
                .build();
    }

    /** updateTimetable > 오른쪽 표에 노출될 요일 목록*/
    private List<String> convertDaySortToDayList(int daySort){
        return switch (daySort){
            case 1 -> List.of("토요일");
            case 2 -> List.of("토요일", "일요일");
            case 5 -> List.of("월요일", "화요일", "수요일", "목요일", "금요일");
            case 6 -> List.of("월요일", "화요일", "수요일", "목요일", "금요일", "토요일");
            case 7 -> List.of("월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일");
            default -> List.of("요일 미정");
        };
    }

    /** 수정된 내용 저장*/
    @Transactional
    public void updateTimetable(int timetableId, TimetableRequestDto dto){
        //timetable 조회 및 갱신
        TimetableEntity timetable = timetableRepository.findById(timetableId)
                .orElseThrow(()->new RuntimeException("Timetable not found"));

        AcademiesEntity academy=academiesRepository.getReferenceById(dto.getAcademyId());
        timetable.setAcademy(academy);
        timetable.setTitle(dto.getTitle());
        timetable.setDaySort(dto.getDaySort());
        timetable.setStartDate(dto.getStartDate());
        timetable.setEndDate(dto.getEndDate());

        timetableRepository.save(timetable); //생략 가능하지만 명시적 호출

        //기존 contents와 users 삭제
        timecontentsRepository.deleteByTimetable_timetableId(timetableId);
        timeusersRepository.deleteByTimetable_TimetableId(timetableId);

        // 새로 저장할 timecontents 준비
        List<TimecontentsEntity> contentsEntities = new ArrayList<>();
        Set<Integer> studentIds = new HashSet<>();
        
        for(TimecontentsDto contentDto:dto.getContentsDtoList()){
            TimecontentsEntity.TimecontentsEntityBuilder builder=TimecontentsEntity.builder()
                    .timetable(timetable)
                    .startTime(contentDto.getStartTime().truncatedTo(ChronoUnit.MINUTES))
                    .endTime(contentDto.getEndTime().truncatedTo(ChronoUnit.MINUTES))
                    .type(contentDto.getType())
                    .dayOfWeek(contentDto.getDayOfWeek())
                    .description(contentDto.getDescription());
            
            //classId가 존자할 경우 클래스 정보 및 학생정보 수집
            if(contentDto.getClassId()!=null){
                builder.classes(ClassesEntity.builder().classId(contentDto.getClassId()).build());
                List<Integer> classStudentIds=classUsersRepository.findStudentIdsByClassId(contentDto.getClassId());
                studentIds.addAll(classStudentIds);
            }
            contentsEntities.add(builder.build());
        }
        timecontentsRepository.saveAll(contentsEntities);

        //새로운 timeusers 저장
        List<TimeusersEntity> timeusers=studentIds.stream()
                .map(studentId ->TimeusersEntity.builder()
                        .student(StudentsEntity.builder().studentId(studentId).build())
                        .timetable(timetable)
                        .build())
                .toList();
        timeusersRepository.saveAll(timeusers);
    }




}
