package com.example.user.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.example.user.dto.StudentDto;
import com.example.user.entity.StudentsEntity;
import com.example.user.entity.UsersEntity;
import com.example.user.jpa.StudentsRepository;
import com.example.user.jpa.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentsService {
    private final UsersRepository usersRepository;
    private final StudentsRepository studentsRepository;

    /** 임시 전체 학생 목록 가져오기 */
    public List<StudentDto> getAllStudentsWithNames() {
        return studentsRepository.findAllWithUserNames();
    }

    /**
     * 학원 내 학생 목록 가져오기
     * @param academyId int
     * @return students List<StudentDto>
     */
    public List<StudentDto> getStudentsByAcademy(int academyId) {
        List<StudentsEntity> students = studentsRepository.findAllByAcademy_AcademyId(academyId);

        return students.stream().map(s -> {
            var user = s.getUser();
            var userProfile = user.getUserProfile() != null
                    ? "https://kr.object.ncloudstorage.com/square/mypage/" + user.getUserProfile()
                    : "https://cdn-icons-png.flaticon.com/512/147/147144.png";
            var parent = s.getParent();
            var school = s.getSchool();

            String regDate = user.getCreated_at().toLocalDateTime()
                    .format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

            String formattedPhone = formatPhone(user.getPhone());
            String formattedParentPhone = parent != null ? formatPhone(parent.getUser().getPhone()) : null;
            String parentName = parent != null ? parent.getUser().getName() : null;

            String schoolName = school != null ? school.getName() : null;

            List<String> classNames = new ArrayList<>();
            List<Integer> classIds = new ArrayList<>();
            List<String> teacherNames = new ArrayList<>();
            List<String> teacherSubjects = new ArrayList<>();

            for(var cu : s.getClassUsers()) {
                var classEntity = cu.getClassEntity();
                classNames.add(classEntity.getName());
                classIds.add(classEntity.getClassId());

                var teacher = classEntity.getTeacher();
                teacherNames.add(teacher.getUser().getName());
                teacherSubjects.add(teacher.getSubject());
            }

            return StudentDto.builder()
                    .userId(user.getUser_id())
                    .studentId(s.getStudentId())
                    .username(user.getUsername())
                    .name(user.getName())
                    .userProfile(userProfile)
                    .phone(formattedPhone)
                    .grade(s.getGrade())
                    .room(s.getRoom())
                    .regDate(regDate)
                    .parentName(parentName)
                    .parentPhone(formattedParentPhone)
                    .classNames(classNames)
                    .classIds(classIds)
                    .schoolName(schoolName)
                    .teacherNames(teacherNames)
                    .teacherSubjects(teacherSubjects)
                    .build();
        }).toList();
    }

    /**
     * 학원 내 keyword 포함한 학생 반환
     * @param academyId int
     * @param keyword String
     * @return List<StudentDto>
     */
    public List<StudentDto> searchStudentByName(int academyId, String keyword) {
        List<StudentsEntity> entities = studentsRepository.findByAcademy_AcademyIdAndUser_NameContaining(academyId, keyword);

        return entities.stream().map(s -> {
            var user = s.getUser();
            var userProfile = user.getUserProfile() != null
                    ? "https://kr.object.ncloudstorage.com/square/mypage/" + user.getUserProfile()
                    : "https://cdn-icons-png.flaticon.com/512/147/147144.png";
            var parent = s.getParent();
            var school = s.getSchool();

            String regDate = user.getCreated_at().toLocalDateTime()
                    .format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

            String formattedPhone = formatPhone(user.getPhone());
            String formattedParentPhone = parent != null ? formatPhone(parent.getUser().getPhone()) : null;
            String parentName = parent != null ? parent.getUser().getName() : null;

            String schoolName = school != null ? school.getName() : null;

            List<String> classNames = new ArrayList<>();
            List<Integer> classIds = new ArrayList<>();
            List<String> teacherNames = new ArrayList<>();
            List<String> teacherSubjects = new ArrayList<>();

            for(var cu : s.getClassUsers()) {
                var classEntity = cu.getClassEntity();
                classNames.add(classEntity.getName());
                classIds.add(classEntity.getClassId());

                var teacher = classEntity.getTeacher();
                teacherNames.add(teacher.getUser().getName());
                teacherSubjects.add(teacher.getSubject());
            }

            return StudentDto.builder()
                    .userId(user.getUser_id())
                    .studentId(s.getStudentId())
                    .username(user.getUsername())
                    .name(user.getName())
                    .userProfile(userProfile)
                    .phone(formattedPhone)
                    .grade(s.getGrade())
                    .room(s.getRoom())
                    .regDate(regDate)
                    .classNames(classNames)
                    .classIds(classIds)
                    .parentName(parentName)
                    .parentPhone(formattedParentPhone)
                    .schoolName(schoolName)
                    .teacherNames(teacherNames)
                    .teacherSubjects(teacherSubjects)
                    .build();
        }).toList();
    }

    // 핸드폰 번호 포맷 함수
    private String formatPhone(String phone) {
        if(phone == null || phone.length() != 11)
            return phone;
        return phone.replaceAll("(\\d{3})(\\d{4})(\\d{4})", "$1-$2-$3");
    }

    /** userId에 대한 studentId 조회*/
    public int getStudentIdByUserId(int userId ){
        StudentsEntity student=studentsRepository.findByUserId(userId );
        if(student==null){
            throw new IllegalArgumentException("학생 정보가 없습니다.");
        }
        return student.getStudentId();
    }

    /** parentId에 대한 student List 조회 */
    public List<StudentDto> getStudentsByParentId(int parentId){
        List<StudentsEntity> students = studentsRepository.findByParentParentId(parentId);
        return students.stream()
                .map(student -> new StudentDto(student.getStudentId(), student.getUser().getName()))
                .collect(Collectors.toList());
    }

    public void deleteStudentByUserId(int userId) {
        UsersEntity user = usersRepository.findById(userId)
                        .orElseThrow(() -> new NotFoundException("NOT FOUND USER"));
        usersRepository.delete(user);
    }

}
