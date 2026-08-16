package com.classconnect.service;

import com.classconnect.model.StudentProgress;
import com.classconnect.repository.StudentProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StudentProgressService {

    @Autowired
    private StudentProgressRepository studentProgressRepository;

    public List<StudentProgress> findByStudentId(String studentId) {
        return studentProgressRepository.findByStudentId(studentId);
    }

    public List<StudentProgress> findByExperimentId(String experimentId) {
        return studentProgressRepository.findByExperimentId(experimentId);
    }

    public StudentProgress updateProgress(StudentProgress progress) {
        Optional<StudentProgress> existing = studentProgressRepository
                .findByStudentIdAndExperimentId(progress.getStudentId(), progress.getExperimentId());

        if (existing.isPresent()) {
            progress.setId(existing.get().getId());
        }

        progress.setUpdatedAt(LocalDateTime.now());
        return studentProgressRepository.save(progress);
    }
}
