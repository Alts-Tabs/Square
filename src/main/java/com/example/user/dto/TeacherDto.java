package com.example.user.dto;

import com.example.user.entity.TeachersEntity;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TeacherDto {
    private int teacherId;
    private String teacherName;
    private String subject;

    public static TeacherDto fromEntity(TeachersEntity entity) {
        return new TeacherDto(
                entity.getTeacherId(),
                entity.getUser().getName(),
                entity.getSubject()
        );
    }
    public TeacherDto(String subject, String teacherName) {
        this.subject = subject;
        this.teacherName = teacherName;
    }
}
