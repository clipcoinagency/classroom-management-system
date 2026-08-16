package com.classconnect.service;

import com.classconnect.model.Experiment;
import com.classconnect.repository.ExperimentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExperimentService {

    @Autowired
    private ExperimentRepository experimentRepository;

    public List<Experiment> findAll() {
        return experimentRepository.findAll();
    }

    public Optional<Experiment> findById(String id) {
        return experimentRepository.findById(id);
    }

    public Experiment save(Experiment experiment) {
        return experimentRepository.save(experiment);
    }

    public void deleteById(String id) {
        experimentRepository.deleteById(id);
    }
}
