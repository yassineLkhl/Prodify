package com.prodify.api.repository;

import com.prodify.api.model.Order;
import com.prodify.api.model.OrderStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    // Récupérer toutes les commandes d'un utilisateur
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

    // Récupérer toutes les commandes d'un utilisateur avec un statut spécifique
    List<Order> findAllByUserIdAndStatus(UUID userId, OrderStatus status);
}
