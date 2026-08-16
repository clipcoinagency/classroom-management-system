package com.classconnect.controller;

import com.classconnect.model.Resource;
import com.classconnect.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.findAll();
    }

    @PostMapping
    public ResponseEntity<?> uploadResource(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("uploadedBy") String uploadedBy) {
        try {
            Resource saved = resourceService.upload(file, title, uploadedBy);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Could not store file");
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadResource(@PathVariable String id) {
        Optional<Resource> resourceOptional = resourceService.findById(id);
        if (resourceOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = resourceOptional.get();
        try {
            byte[] fileBytes = resourceService.readFile(resource);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFileName() + "\"")
                    .body(fileBytes);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Could not read file");
        }
    }
}
