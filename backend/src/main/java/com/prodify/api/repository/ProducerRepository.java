package com.prodify.api.repository;

import com.prodify.api.model.Producer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProducerRepository extends JpaRepository<Producer, UUID> {
    
    // Trouver un producteur via son URL (slug)
    Optional<Producer> findBySlug(String slug);
    
    // Vérifier si un slug est déjà pris (indispensable lors de la création)
    boolean existsBySlug(String slug);

    // Trouver le profil producteur associé à un compte utilisateur
    Optional<Producer> findByUserId(UUID userId);
    
    // Savoir si cet utilisateur est déjà producteur
    boolean existsByUserId(UUID userId);
}