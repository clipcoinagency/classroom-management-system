package com.classconnect.controller;

import com.classconnect.model.StudentProgress;
import com.classconnect.service.StudentProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class StudentProgressController {

    @Autowired
    private StudentProgressService studentProgressService;

    @GetMapping("/student/{studentId}")
    public List<StudentProgress> getProgressByStudent(@PathVariable String studentId) {
        return studentProgressService.findByStudentId(studentId);
    }

    @GetMapping("/experiment/{experimentId}")
    public List<StudentProgress> getProgressByExperiment(@PathVariable String experimentId) {
        return studentProgressService.findByExperimentId(experimentId);
    }

    @PostMapping
    public StudentProgress updateProgress(@RequestBody StudentProgress progress) {
        return studentProgressService.updateProgress(progress);
    }
}
