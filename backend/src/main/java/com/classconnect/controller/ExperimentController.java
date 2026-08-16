package com.classconnect.controller;

import com.classconnect.model.Experiment;
import com.classconnect.service.ExperimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/experiments")
public class ExperimentController {

    @Autowired
    private ExperimentService experimentService;

    @GetMapping
    public List<Experiment> getAllExperiments() {
        return experimentService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Experiment> getExperiment(@PathVariable String id) {
        return experimentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Experiment createExperiment(@RequestBody Experiment experiment) {
        return experimentService.save(experiment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experiment> updateExperiment(@PathVariable String id, @RequestBody Experiment experiment) {
        if (experimentService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        experiment.setId(id);
        return ResponseEntity.ok(experimentService.save(experiment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExperiment(@PathVariable String id) {
        experimentService.deleteById(id);
        return ResponseEntity.ok("Experiment deleted successfully");
    }
}
