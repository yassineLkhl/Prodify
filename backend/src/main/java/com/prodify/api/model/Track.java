package com.prodify.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tracks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Track {

    @Id
    @UuidGenerator
    private UUID id;

    // --- RELATION ---
    // Une track appartient à un seul producteur.
    // Un producteur a plusieurs tracks.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producer_id", nullable = false)
    @JsonIgnoreProperties({"user", "createdAt", "updatedAt"}) // Pour éviter d'afficher tout le user du producteur quand on liste les tracks (trop lourd)
    private Producer producer;

    // --- INFOS DE BASE ---
    @Column(nullable = false)
    private String title;

    // ex: "prodify.com/track/mon-titre-incroyable"
    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    // --- METADATA MUSIQUE ---
    private Integer bpm; // Battements par minute
    
    private String genre; // ex: "Trap", "Drill", "Boombap"
    
    private String mood; // ex: "Dark", "Happy", "Aggressive"

    // --- FICHIERS (URLs stockées) ---
    // Pour l'instant, on stockera l'URL du fichier (ex: lien S3 ou local).
    // On ne gère pas l'upload binaire tout de suite.
    @Column(nullable = false)
    private String coverImageUrl;

    @Column(nullable = false)
    private String audioUrl; // Le MP3 taggé pour l'écoute gratuite

    // --- PRIX ---
    @Column(nullable = false)
    private BigDecimal price; // Utiliser BigDecimal pour l'argent !

    // --- STATUT ---
    @Builder.Default
    private boolean isSold = false; // Si vendu en exclusivité

    @Column(nullable = false)
    private OffsetDateTime createdAt;
    
    private OffsetDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}