package com.example.user.entity;

public class UserAcademyResolver {
    public static Integer getAcademyId(UsersEntity user) {
        if(user == null || user.getRole() == null) {
            return null;
        }

        switch (user.getRole()) {
            case ROLE_DIRECTOR:
                if (user.getAcademies() != null && !user.getAcademies().isEmpty()) {
                    return user.getAcademies().get(0).getAcademyId();
                }
                break;

            case ROLE_TEACHER:
                if (user.getTeacher() != null && user.getTeacher().getAcademy() != null) {
                    return user.getTeacher().getAcademy().getAcademyId();
                }
                break;

            case ROLE_PARENT:
                if (user.getParent() != null && user.getParent().getAcademy() != null) {
                    return user.getParent().getAcademy().getAcademyId();
                }
                break;

            case ROLE_STUDENT:
                if (user.getStudents() != null && !user.getStudents().isEmpty()) {
                    StudentsEntity student = user.getStudents().get(0);
                    if (student.getAcademy() != null) {
                        return student.getAcademy().getAcademyId();
                    }
                }
                break;
        }

        return null; // 학원 정보 없음
    }
}
