package com.classconnect.service;

import com.classconnect.model.Resource;
import com.classconnect.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Value("${app.upload-dir}")
    private String uploadDir;

    public List<Resource> findAll() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> findById(String id) {
        return resourceRepository.findById(id);
    }

    public Resource upload(MultipartFile file, String title, String uploadedBy) throws IOException {
        Files.createDirectories(Paths.get(uploadDir));

        String originalName = file.getOriginalFilename();
        String extension = "FILE";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf('.') + 1).toUpperCase();
        }

        String storedFileName = UUID.randomUUID() + "_" + originalName;
        Path destination = Paths.get(uploadDir).resolve(storedFileName);
        file.transferTo(destination);

        Resource resource = new Resource(title, originalName, storedFileName, extension, uploadedBy);
        return resourceRepository.save(resource);
    }

    public byte[] readFile(Resource resource) throws IOException {
        Path path = Paths.get(uploadDir).resolve(resource.getStoredFileName());
        return Files.readAllBytes(path);
    }
}
