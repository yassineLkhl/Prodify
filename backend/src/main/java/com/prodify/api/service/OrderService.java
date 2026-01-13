package com.prodify.api.service;

import com.prodify.api.dto.order.OrderItemResponse;
import com.prodify.api.dto.order.OrderResponse;
import com.prodify.api.model.Order;
import com.prodify.api.model.OrderItem;
import com.prodify.api.model.OrderStatus;
import com.prodify.api.model.Track;
import com.prodify.api.model.User;
import com.prodify.api.repository.OrderRepository;
import com.prodify.api.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final TrackRepository trackRepository;

    @Transactional
    public OrderResponse createOrder(User user, List<UUID> trackIds) {
        // 1. Vérifier que la liste n'est pas vide
        if (trackIds == null || trackIds.isEmpty()) {
            throw new RuntimeException("La commande doit contenir au moins une track.");
        }

        // 2. Récupérer les tracks depuis la BDD
        List<Track> tracks = trackIds.stream()
                .map(trackId -> trackRepository.findById(trackId)
                        .orElseThrow(() -> new RuntimeException("Track introuvable avec l'ID: " + trackId)))
                .collect(Collectors.toList());

        // 3. Vérifier qu'aucune track n'est déjà vendue (si nécessaire)
        // Pour l'instant, on permet l'achat même si isSold = true (on peut changer ça plus tard)

        // 4. Calculer le total
        BigDecimal totalAmount = tracks.stream()
                .map(Track::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 5. Créer l'Order
        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .build();

        // 6. Créer les OrderItems avec snapshot du prix
        List<OrderItem> orderItems = tracks.stream()
                .map(track -> OrderItem.builder()
                        .order(order)
                        .track(track)
                        .price(track.getPrice()) // Snapshot du prix au moment de l'achat
                        .build())
                .collect(Collectors.toList());

        // 7. Associer les items à l'order
        order.setItems(orderItems);

        // 8. Sauvegarder l'order (les items seront sauvegardés automatiquement grâce à CascadeType.ALL)
        Order savedOrder = orderRepository.save(order);

        // 9. Convertir en OrderResponse
        return convertToOrderResponse(savedOrder);
    }

    private OrderResponse convertToOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .trackId(item.getTrack().getId())
                        .trackTitle(item.getTrack().getTitle())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}

