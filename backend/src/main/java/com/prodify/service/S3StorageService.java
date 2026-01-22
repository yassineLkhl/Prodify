package com.prodify.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

@Service
public class S3StorageService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String awsRegion;

    public S3StorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Sauvegarde un fichier sur AWS S3 et retourne l'URL publique
     *
     * @param file Le fichier à uploader
     * @return L'URL publique du fichier
     * @throws IOException Si une erreur survient lors de la lecture du fichier
     */
    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide.");
        }

        // Extraire l'extension originale
        String originalFilename = Objects.requireNonNullElse(file.getOriginalFilename(), "");
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
            extension = originalFilename.substring(dotIndex);
        }

        // Générer un nom unique pour le fichier
        String uniqueFileName = UUID.randomUUID() + extension;

        // Préparer la requête PutObject pour S3
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(uniqueFileName)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

        // Uploader le fichier vers S3
        s3Client.putObject(
                putObjectRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize())
        );

        // Construire et retourner l'URL publique
        String publicUrl = String.format(
                "https://%s.s3.%s.amazonaws.com/%s",
                bucketName,
                awsRegion,
                uniqueFileName
        );

        return publicUrl;
    }
}
