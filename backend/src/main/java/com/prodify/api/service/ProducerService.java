package com.prodify.api.service;

import com.prodify.api.dto.producer.ProducerRequest;
import com.prodify.api.model.Producer;
import com.prodify.api.model.User;
import com.prodify.api.repository.ProducerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProducerService {

    private final ProducerRepository producerRepository;

    public Producer createProducerProfile(User user, ProducerRequest request) {
        // 1. Vérifier si l'utilisateur n'est pas déjà producteur
        if (producerRepository.existsByUserId(user.getId())) {
            throw new RuntimeException("Vous avez déjà un profil producteur.");
        }

        // 2. Générer un slug unique à partir du nom d'artiste
        String slug = generateSlug(request.getDisplayName());

        // 3. Créer l'entité
        Producer producer = Producer.builder()
                .user(user) // On lie le compte utilisateur
                .displayName(request.getDisplayName())
                .slug(slug)
                .bio(request.getBio())
                .build();

        return producerRepository.save(producer);
    }

    
    // 4. Récupérer un producteur par son ID
    public Producer getProducerById(UUID id) {
        return producerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producteur non trouvé"));
    }

    // 5. Lister tous les producteurs
    public List<Producer> getAllProducers() {
        return producerRepository.findAll();
    }

    // 6. Récupérer le producteur de l'utilisateur connecté
    public Producer getProducerByUser(User user) {
        return producerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil producteur non trouvé"));
    }

    // 7. Récupérer un producteur par son Slug (URL lisible)
    public Producer getProducerBySlug(String slug) {
        return producerRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Producteur avec le slug '" + slug + "' non trouvé"));
    }

    // --- Utilitaire pour transformer "DJ Yassine !" en "dj-yassine" ---
    private String generateSlug(String input) {
        String slug = toSlug(input);
        
        // Si le slug existe déjà (ex: "dj-yassine"), on ajoute un suffixe aléatoire
        // C'est basique, on pourra améliorer plus tard
        if (producerRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis() % 1000;
        }
        return slug;
    }

    private String toSlug(String input) {
        String nonLatin = Pattern.compile("[^\\w-]").matcher(Normalizer.normalize(input, Normalizer.Form.NFD)).replaceAll("");
        return nonLatin.toLowerCase(Locale.ENGLISH).replace(" ", "-");
    }
}