package com.classconnect.controller;

import com.classconnect.dto.AttendanceRequest;
import com.classconnect.model.Attendance;
import com.classconnect.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceService.findAll();
    }

    @GetMapping("/student/{studentId}")
    public List<Attendance> getAttendanceForStudent(@PathVariable String studentId) {
        return attendanceService.findByStudentId(studentId);
    }

    @PostMapping
    public Attendance markAttendance(@RequestBody AttendanceRequest request) {
        return attendanceService.markAttendance(request.getStudentId(), request.getStatus());
    }
}
