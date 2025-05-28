package com.example.classes.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RegisterResultDto {
    @Data
    public static class RegisterError {
        private Integer studentId; // null 가능
        private String code;
        private String message;

        public RegisterError(Integer studentId, String code, String message) {
            this.studentId = studentId;
            this.code = code;
            this.message = message;
        }
    }

    private List<RegisterError> errors = new ArrayList<>();

    public void addError(Integer studentId, String code, String message) {
        errors.add(new RegisterError(studentId, code, message));
    }
}
