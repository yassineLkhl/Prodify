package com.prodify.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final String UPLOAD_DIR = "uploads";

    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide.");
        }

        // Create upload directory if it does not exist
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        if (Files.notExists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Extract original extension
        String originalFilename = Objects.requireNonNullElse(file.getOriginalFilename(), "");
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
            extension = originalFilename.substring(dotIndex);
        }

        // Generate unique filename
        String uniqueName = UUID.randomUUID() + extension;
        Path targetLocation = uploadPath.resolve(uniqueName);

        // Save file
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Return stored filename (used to build public URL)
        return uniqueName;
    }
}


