package com.prodify.api.service;

import com.prodify.api.model.Order;
import com.prodify.api.model.OrderStatus;
import com.prodify.api.model.Track;
import com.prodify.api.model.User;
import com.prodify.api.repository.OrderRepository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final OrderRepository orderRepository;

    /**
     * Récupère toutes les tracks achetées par l'utilisateur connecté.
     *
     * @param user L'utilisateur connecté
     * @return Liste unique des Track achetées (doublons supprimés)
     */
    @Transactional(readOnly = true)
    public List<Track> getPurchasedTracks(User user) {
        // 1. Récupérer toutes les commandes COMPLETED de l'utilisateur
        List<Order> completedOrders =
                orderRepository.findAllByUserIdAndStatus(user.getId(), OrderStatus.COMPLETED);

        // 2. Extraire tous les OrderItems et les mapper en Track
        // Utiliser un Set pour éviter les doublons (si l'user a acheté la même track 2 fois)
        Set<Track> purchasedTracks =
                completedOrders.stream()
                        .flatMap(order -> order.getItems().stream()) // Récupère tous les OrderItems
                        .map(orderItem -> orderItem.getTrack()) // Extrait la Track
                        .collect(Collectors.toSet()); // Set pour les doublons

        // 3. Convertir en List et retourner (peut être trié par titre ou date)
        return purchasedTracks.stream()
                .sorted(
                        (t1, t2) ->
                                t2.getCreatedAt()
                                        .compareTo(
                                                t1.getCreatedAt())) // Tri DESC par date de création
                .collect(Collectors.toList());
    }
}
