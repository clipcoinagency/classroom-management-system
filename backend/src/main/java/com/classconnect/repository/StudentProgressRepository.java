package com.classconnect.repository;

import com.classconnect.model.StudentProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface StudentProgressRepository extends MongoRepository<StudentProgress, String> {

    List<StudentProgress> findByStudentId(String studentId);

    List<StudentProgress> findByExperimentId(String experimentId);

    Optional<StudentProgress> findByStudentIdAndExperimentId(String studentId, String experimentId);
}
