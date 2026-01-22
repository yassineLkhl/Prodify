package com.prodify.api.controller;

import com.prodify.api.dto.track.TrackRequest;
import com.prodify.api.dto.track.TrackSearchCriteria;
import com.prodify.api.model.Track;
import com.prodify.api.model.User;
import com.prodify.api.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackService trackService;

    // 1. Créer une Track (Sécurisé)
    @PostMapping
    public ResponseEntity<Track> createTrack(
            @RequestBody TrackRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(trackService.createTrack(user, request));
    }

    // 2. Lister toutes les Tracks (Public)
    @GetMapping
    public ResponseEntity<List<Track>> getAllTracks() {
        return ResponseEntity.ok(trackService.getAllTracks());
    }

    // 2b. Rechercher les Tracks avec des critères (Public)
    // POST pour pouvoir envoyer un objet JSON complexe dans le body
    @PostMapping("/search")
    public ResponseEntity<List<Track>> searchTracks(@RequestBody TrackSearchCriteria criteria) {
        return ResponseEntity.ok(trackService.searchTracks(criteria));
    }

    // 3. Voir une Track spécifique (Public)
    @GetMapping("/{id}")
    public ResponseEntity<Track> getTrackById(@PathVariable UUID id) {
        return ResponseEntity.ok(trackService.getTrackById(id));
    }

    // 4. Voir les Tracks d'un producteur spécifique (Public) - par ID
    // URL : /api/tracks/producer/{producerId}
    @GetMapping("/producer/{producerId}")
    public ResponseEntity<List<Track>> getTracksByProducer(@PathVariable UUID producerId) {
        return ResponseEntity.ok(trackService.getTracksByProducer(producerId));
    }

    // 4b. Voir les Tracks d'un producteur spécifique (Public) - par Slug
    // URL : /api/tracks/producer-slug/mon-beatmaker-cool
    @GetMapping("/producer-slug/{slug}")
    public ResponseEntity<List<Track>> getTracksByProducerSlug(@PathVariable String slug) {
        return ResponseEntity.ok(trackService.getTracksByProducerSlug(slug));
    }

    // 5. Supprimer une Track (Sécurisé - uniquement le propriétaire)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrack(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        trackService.deleteTrack(id, user);
        return ResponseEntity.noContent().build();
    }
}