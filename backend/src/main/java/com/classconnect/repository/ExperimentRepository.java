package com.classconnect.repository;

import com.classconnect.model.Experiment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExperimentRepository extends MongoRepository<Experiment, String> {
}
