package com.prodify.api.repository;

import com.prodify.api.model.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrackRepository extends JpaRepository<Track, UUID> {
    
    Optional<Track> findBySlug(String slug);
    
    boolean existsBySlug(String slug);
    
    // Pour afficher le catalogue d'un beatmaker spécifique
    List<Track> findByProducerId(UUID producerId);
}