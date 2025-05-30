package com.example.schedule.entity;

public enum ScheduleType {
    // DB 저장 값 - ACADEMIC, ACADEMY
    ACADEMIC("학사"),
    ACADEMY("학원");

    private final String label;

    ScheduleType(String label) {
        this.label = label;
    }

    // 사용자 UI 표시 - .getLabel() => 학사 & 학원 표시
    public String getLabel() {
        return label;
    }
}
