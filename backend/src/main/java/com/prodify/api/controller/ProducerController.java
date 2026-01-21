package com.prodify.api.controller;

import com.prodify.api.dto.producer.ProducerRequest;
import com.prodify.api.model.Producer;
import com.prodify.api.model.User;
import com.prodify.api.service.ProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
    import java.util.UUID;

@RestController
@RequestMapping("/api/producers")
@RequiredArgsConstructor
public class ProducerController {

    private final ProducerService producerService;

    @PostMapping
    public ResponseEntity<Producer> createProducer(
            @RequestBody ProducerRequest request,
            Authentication authentication // <--- C'est ici que Spring nous donne l'utilisateur connecté
    ) {
        // 1. On récupère l'utilisateur depuis le contexte de sécurité
        // Comme notre classe User implémente UserDetails, on peut faire le cast directement.
        User user = (User) authentication.getPrincipal();

        // 2. On appelle le service
        Producer createdProducer = producerService.createProducerProfile(user, request);

        // 3. On retourne le résultat
        return ResponseEntity.ok(createdProducer);
    }

    @GetMapping
    public ResponseEntity<List<Producer>> getAllProducers() {
        return ResponseEntity.ok(producerService.getAllProducers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producer> getProducerById(@PathVariable UUID id) {
        return ResponseEntity.ok(producerService.getProducerById(id));
    }

    // Récupérer le producteur de l'utilisateur connecté
    @GetMapping("/me")
    public ResponseEntity<Producer> getMyProducer(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(producerService.getProducerByUser(user));
    }

    // Récupérer un producteur via son Slug (URL lisible)
    // URL : /api/producers/slug/mon-beatmaker-cool
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Producer> getProducerBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(producerService.getProducerBySlug(slug));
    }
}