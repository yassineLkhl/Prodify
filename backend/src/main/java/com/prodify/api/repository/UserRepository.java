package com.prodify.api.repository;

import com.prodify.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // Essentiel pour le login
    Optional<User> findByEmail(String email);
    
    // Essentiel pour l'inscription (vérifier doublons)
    boolean existsByEmail(String email);
}