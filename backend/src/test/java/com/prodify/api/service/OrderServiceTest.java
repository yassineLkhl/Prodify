package com.prodify.api.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import com.prodify.api.dto.order.OrderResponse;
import com.prodify.api.model.Order;
import com.prodify.api.model.OrderStatus;
import com.prodify.api.model.Track;
import com.prodify.api.model.User;
import com.prodify.api.repository.OrderRepository;
import com.prodify.api.repository.TrackRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private TrackRepository trackRepository;

    @Mock private OrderRepository orderRepository;

    @InjectMocks private OrderService orderService;

    private User testUser;
    private Track track1;
    private Track track2;
    private UUID track1Id;
    private UUID track2Id;

    @BeforeEach
    void setUp() {
        // Initialiser l'utilisateur
        testUser =
                User.builder()
                        .id(UUID.randomUUID())
                        .firstName("Alice")
                        .lastName("Martin")
                        .email("alice@example.com")
                        .build();

        // Initialiser les tracks avec leurs IDs
        track1Id = UUID.randomUUID();
        track1 =
                Track.builder()
                        .id(track1Id)
                        .title("Beat 1")
                        .slug("beat-1")
                        .price(BigDecimal.valueOf(10.00))
                        .bpm(140)
                        .genre("Trap")
                        .build();

        track2Id = UUID.randomUUID();
        track2 =
                Track.builder()
                        .id(track2Id)
                        .title("Beat 2")
                        .slug("beat-2")
                        .price(BigDecimal.valueOf(20.00))
                        .bpm(120)
                        .genre("Drill")
                        .build();
    }

    @Test
    void createOrder_Success() {
        // Arrange
        List<UUID> trackIds = Arrays.asList(track1Id, track2Id);

        // Mock les appels au repository pour retrouver les tracks
        when(trackRepository.findById(track1Id)).thenReturn(Optional.of(track1));
        when(trackRepository.findById(track2Id)).thenReturn(Optional.of(track2));

        // Créer l'order mock qui sera retourné après la sauvegarde
        Order savedOrder =
                Order.builder()
                        .id(UUID.randomUUID())
                        .user(testUser)
                        .status(OrderStatus.PENDING)
                        .totalAmount(BigDecimal.valueOf(30.00))
                        .items(new ArrayList<>())
                        .build();

        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        // Act
        OrderResponse response = orderService.createOrder(testUser, trackIds);

        // Assert - Vérification IMPORTANTE : le totalAmount doit être 30€
        assertThat(response)
                .isNotNull()
                .satisfies(
                        order -> {
                            assertThat(order.getTotalAmount())
                                    .isEqualTo(BigDecimal.valueOf(30.00))
                                    .as("Le montant total doit être égal à 10€ + 20€ = 30€");
                            assertThat(order.getStatus()).isEqualTo(OrderStatus.PENDING);
                        });

        // Vérifier les appels aux repositories
        verify(trackRepository, times(1)).findById(track1Id);
        verify(trackRepository, times(1)).findById(track2Id);
        verify(orderRepository, times(1))
                .save(
                        argThat(
                                order ->
                                        order.getTotalAmount().compareTo(BigDecimal.valueOf(30.00))
                                                == 0));
    }

    @Test
    void createOrder_SingleTrack() {
        // Arrange - Un seul beat
        List<UUID> trackIds = Arrays.asList(track1Id);

        when(trackRepository.findById(track1Id)).thenReturn(Optional.of(track1));

        Order savedOrder =
                Order.builder()
                        .id(UUID.randomUUID())
                        .user(testUser)
                        .status(OrderStatus.PENDING)
                        .totalAmount(BigDecimal.valueOf(10.00))
                        .items(new ArrayList<>())
                        .build();

        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        // Act
        OrderResponse response = orderService.createOrder(testUser, trackIds);

        // Assert
        assertThat(response.getTotalAmount()).isEqualTo(BigDecimal.valueOf(10.00));

        verify(trackRepository, times(1)).findById(track1Id);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void createOrder_EmptyCart() {
        // Arrange - Panier vide
        List<UUID> trackIds = new ArrayList<>();

        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(testUser, trackIds))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("au moins une track");

        // Vérifier que save n'a pas été appelé
        verify(orderRepository, never()).save(any(Order.class));
        verify(trackRepository, never()).findById(any(UUID.class));
    }

    @Test
    void createOrder_NullCart() {
        // Arrange - Panier null
        List<UUID> trackIds = null;

        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(testUser, trackIds))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("au moins une track");

        // Vérifier que save n'a pas été appelé
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void createOrder_TrackNotFound() {
        // Arrange - Un track n'existe pas
        List<UUID> trackIds = Arrays.asList(track1Id, track2Id);

        when(trackRepository.findById(track1Id)).thenReturn(Optional.of(track1));
        when(trackRepository.findById(track2Id))
                .thenReturn(Optional.empty()); // Track2 n'existe pas

        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(testUser, trackIds))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Track introuvable");

        // Vérifier que save n'a pas été appelé
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void validateOrder_Success() {
        // Arrange
        UUID orderId = UUID.randomUUID();
        Order order =
                Order.builder()
                        .id(orderId)
                        .user(testUser)
                        .status(OrderStatus.PENDING)
                        .totalAmount(BigDecimal.valueOf(30.00))
                        .items(new ArrayList<>())
                        .build();

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        Order completedOrder =
                Order.builder()
                        .id(orderId)
                        .user(testUser)
                        .status(OrderStatus.COMPLETED)
                        .totalAmount(BigDecimal.valueOf(30.00))
                        .items(new ArrayList<>())
                        .build();

        when(orderRepository.save(any(Order.class))).thenReturn(completedOrder);

        // Act
        Order validatedOrder = orderService.validateOrder(orderId);

        // Assert
        assertThat(validatedOrder)
                .isNotNull()
                .satisfies(
                        o -> {
                            assertThat(o.getStatus()).isEqualTo(OrderStatus.COMPLETED);
                            assertThat(o.getId()).isEqualTo(orderId);
                        });

        verify(orderRepository, times(1)).findById(orderId);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void validateOrder_NotFound() {
        // Arrange
        UUID orderId = UUID.randomUUID();
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> orderService.validateOrder(orderId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("introuvable");

        // Vérifier que save n'a pas été appelé
        verify(orderRepository, never()).save(any(Order.class));
    }
}
