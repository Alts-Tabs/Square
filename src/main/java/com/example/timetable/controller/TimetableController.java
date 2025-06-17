package com.example.timetable.controller;

import com.example.security.CustomUserDetails;
import com.example.timetable.dto.TimecontentsDto;
import com.example.timetable.dto.TimetableDto;
import com.example.timetable.dto.TimetableRequestDto;
import com.example.timetable.dto.TimetableResponseDto;
import com.example.timetable.service.TimetableService;
import com.example.user.dto.JoinDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class TimetableController {

    private final TimetableService timetableService;

    /** 시간표 등록*/
    @PostMapping("/public/saveTimetable")
    public ResponseEntity<String> saveTimetable(@RequestBody TimetableRequestDto dto){
        timetableService.saveTimetable(dto);
        return ResponseEntity.ok("시간표가 저장되었습니다.");
    }

    /**시간표 조회 - academyId 기준 */
    @GetMapping("/public/timetablelist")
    public ResponseEntity<List<TimetableDto>> getTimetableList(@RequestParam int academyId){
        List<TimetableDto> list=timetableService.getByAcademyID(academyId);
        return ResponseEntity.ok(list);
    }

    /**시간표 상세 조회
     * 시간 정보만 내려주고 요일은 프론트에서 처리 예정*/
    @GetMapping("/public/{timetableId}/timecontents")
    public ResponseEntity<List<TimecontentsDto>> getTimecontents(@PathVariable int timetableId){
        List<TimecontentsDto> contents = timetableService.getContentsByTimetableId(timetableId);
        return ResponseEntity.ok(contents);
    }

    /** 시간표 상세 조회 (편집용): timetable + contents + users + 요일리스트 */
    @GetMapping("/public/timetable/{timetableId}/detail")
    public ResponseEntity<TimetableResponseDto> getTimetableDetail(@PathVariable int timetableId) {
        TimetableResponseDto responseDto = timetableService.getTimetableDetail(timetableId);
        return ResponseEntity.ok(responseDto);
    }

    /**시간표 수정
     * @param timetableId 수정할 시간표의 ID
     * @param dto 클리이언트로부터 전달받은 시간표 수정 정보
     * */
    @PutMapping("/public/updateTimetab/{timetableId}")
    public ResponseEntity<String> updateTimetable(
            @PathVariable int timetableId,
            @RequestBody TimetableRequestDto dto){
        timetableService.updateTimetable(timetableId, dto);
        return ResponseEntity.ok("시간표가 정상적으로 수정되었습니다.");
    }

    //    [출석부] ================================================================================
    /** 현재 시간 기준, 특정 강사가 진행 중인 수업 조회 */
    @GetMapping("/public/current-class")
    public ResponseEntity<TimecontentsDto> getCurrentClassForTeacher(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Optional<TimecontentsDto> timecontentsDto = timetableService.getCurrentClassForTeacher(userDetails.getUserId());
        return timecontentsDto.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping("/public/current-students")
    public ResponseEntity<List<JoinDto>> getStudentsOfCurrentClass(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<JoinDto> students = timetableService.getStudentsOfCurrentClass(userDetails.getUserId());
        return ResponseEntity.ok(students);
    }

    /**시간표 삭제*/
    @DeleteMapping("/public/deleteTimetable")
    public ResponseEntity<String> deleteTimetable(@RequestParam int timetableId){
        timetableService.deleteTimetable(timetableId);
        return ResponseEntity.ok("삭제 완료");
    }
}
