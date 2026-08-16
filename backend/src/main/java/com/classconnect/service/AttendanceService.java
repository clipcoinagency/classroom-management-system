package com.classconnect.service;

import com.classconnect.model.Attendance;
import com.classconnect.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    public List<Attendance> findAll() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> findByStudentId(String studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public Attendance markAttendance(String studentId, String status) {
        Optional<Attendance> alreadyMarkedToday = attendanceRepository.findByStudentId(studentId).stream()
                .filter(a -> a.getMarkedAt().toLocalDate().equals(LocalDate.now()))
                .findFirst();

        if (alreadyMarkedToday.isPresent()) {
            return alreadyMarkedToday.get();
        }

        return attendanceRepository.save(new Attendance(studentId, status));
    }
}
