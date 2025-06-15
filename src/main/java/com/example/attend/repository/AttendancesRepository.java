package com.example.attend.repository;

import com.example.attend.entity.AttendancesEntity;
import com.example.attend.entity.TimetableAttendEntity;
import com.example.user.entity.StudentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendancesRepository extends JpaRepository<AttendancesEntity, Integer> {
    List<AttendancesEntity> findAllByTimetableAttend(TimetableAttendEntity timetableAttend);
    AttendancesEntity findByTimetableAttendAndStudent(TimetableAttendEntity timetableAttend, StudentsEntity student);

}
