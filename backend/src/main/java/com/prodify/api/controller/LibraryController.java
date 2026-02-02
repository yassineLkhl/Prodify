package com.prodify.api.controller;

import com.prodify.api.model.Track;
import com.prodify.api.model.User;
import com.prodify.api.service.LibraryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    /**
     * Récupère la liste des tracks achetées par l'utilisateur connecté.
     *
     * @param authentication Infos de l'utilisateur connecté (injecté automatiquement par Spring)
     * @return Liste des Track achetées
     */
    @GetMapping
    public ResponseEntity<List<Track>> getPurchasedTracks(Authentication authentication) {
        // 1. Vérifier que l'utilisateur est connecté
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Tentative d'accès à la bibliothèque sans authentification");
            return ResponseEntity.status(401).build();
        }

        // 2. Récupérer l'User depuis le contexte Spring Security
        // Le Principal contient l'objet User stocké lors de l'authentification
        User user = (User) authentication.getPrincipal();

        // 3. Récupérer les tracks achetées
        log.info("Récupération de la bibliothèque pour l'utilisateur : {}", user.getId());
        List<Track> purchasedTracks = libraryService.getPurchasedTracks(user);

        // 4. Retourner la liste
        return ResponseEntity.ok(purchasedTracks);
    }
}
