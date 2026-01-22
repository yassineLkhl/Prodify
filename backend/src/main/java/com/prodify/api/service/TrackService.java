package com.prodify.api.service;

import com.prodify.api.dto.track.TrackRequest;
import com.prodify.api.dto.track.TrackSearchCriteria;
import com.prodify.api.model.Producer;
import com.prodify.api.model.Track;
import com.prodify.api.model.User;
import com.prodify.api.repository.ProducerRepository;
import com.prodify.api.repository.TrackRepository;
import com.prodify.api.specification.TrackSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class TrackService {

    private final TrackRepository trackRepository;
    private final ProducerRepository producerRepository;

    // --- CRÉATION ---
    public Track createTrack(User user, TrackRequest request) {
        // 1. Récupérer le profil Producteur de l'utilisateur connecté
        Producer producer = producerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Vous devez créer un profil producteur avant de publier une track."));

        // 2. Générer le slug (URL) unique
        String slug = generateSlug(request.getTitle());

        // 3. Créer la Track
        Track track = Track.builder()
                .title(request.getTitle())
                .slug(slug)
                .description(request.getDescription())
                .price(request.getPrice())
                .bpm(request.getBpm())
                .genre(request.getGenre())
                .mood(request.getMood())
                .coverImageUrl(request.getCoverImageUrl())
                .audioUrl(request.getAudioUrl())
                .producer(producer) // On lie la track au producteur
                .isSold(false)      // Par défaut, pas encore vendue
                .build();

        return trackRepository.save(track);
    }

    // --- LECTURE ---
    public List<Track> getAllTracks() {
        return trackRepository.findAll();
    }

    public Track getTrackById(UUID id) {
        return trackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Track introuvable"));
    }

    // Récupérer les sons d'un producteur spécifique (utile pour la page profil)
    public List<Track> getTracksByProducer(UUID producerId) {
        return trackRepository.findByProducerId(producerId);
    }

    // Récupérer les sons d'un producteur via son Slug (URL lisible)
    public List<Track> getTracksByProducerSlug(String slug) {
        return trackRepository.findByProducerSlug(slug);
    }

    // Rechercher les tracks avec des critères multicritères
    public List<Track> searchTracks(TrackSearchCriteria criteria) {
        return trackRepository.findAll(TrackSpecification.getSpecifications(criteria));
    }

    // --- SUPPRESSION ---
    public void deleteTrack(UUID id, User user) {
        // 1. Récupérer la track
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Track introuvable"));

        // 2. Récupérer le profil producteur de l'utilisateur connecté
        Producer producer = producerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Vous devez être producteur pour supprimer une track."));

        // 3. Vérifier que la track appartient bien au producteur
        if (!track.getProducer().getId().equals(producer.getId())) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer cette track.");
        }

        // 4. Supprimer la track
        trackRepository.delete(track);
    }

    // --- UTILITAIRE SLUG (Même logique que ProducerService) ---
    // Note : Idéalement, on mettrait ça dans une classe utilitaire commune "SlugUtils" plus tard
    private String generateSlug(String title) {
        String baseSlug = toSlug(title);
        String finalSlug = baseSlug;
            
        // Si "mon-beat" existe déjà, on tente "mon-beat-123"
        if (trackRepository.existsBySlug(finalSlug)) {
            finalSlug = baseSlug + "-" + System.currentTimeMillis() % 10000;
        }
        return finalSlug;
    }

    private String toSlug(String input) {
        if (input == null) return "";
        String nonLatin = Pattern.compile("[^\\w-]").matcher(Normalizer.normalize(input, Normalizer.Form.NFD)).replaceAll("");
        return nonLatin.toLowerCase(Locale.ENGLISH).replace(" ", "-");
    }
}