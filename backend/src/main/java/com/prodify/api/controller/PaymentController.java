package com.prodify.api.controller;

import com.prodify.api.dto.payment.PaymentResponse;
import com.prodify.api.model.Order;
import com.prodify.api.model.OrderStatus;
import com.prodify.api.model.User;
import com.prodify.api.repository.OrderRepository;
import com.prodify.api.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderRepository orderRepository;

    @PostMapping("/checkout/{orderId}")
    public ResponseEntity<PaymentResponse> createCheckoutSession(
            @PathVariable UUID orderId,
            Authentication authentication
    ) {
        // 1. Récupérer l'utilisateur connecté
        User user = (User) authentication.getPrincipal();

        // 2. Récupérer l'Order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        // 3. Vérifier que l'Order appartient bien à l'utilisateur connecté
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Vous n'êtes pas autorisé à accéder à cette commande");
        }

        // 4. Vérifier que le statut est bien PENDING
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Cette commande ne peut plus être payée. Statut actuel: " + order.getStatus());
        }

        // 5. Créer la session Stripe
        try {
            // Passer l'ID de l'order au lieu de l'objet pour forcer le re-fetch dans la transaction
            Session session = paymentService.createCheckoutSession(order.getId());
            
            PaymentResponse response = PaymentResponse.builder()
                    .url(session.getUrl())
                    .build();

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            // Logger l'erreur pour le debugging
            e.printStackTrace();
            System.err.println("Erreur Stripe lors de la création de la session de paiement:");
            System.err.println("Message: " + e.getMessage());
            if (e.getCode() != null) {
                System.err.println("Code: " + e.getCode());
            }
            if (e.getStatusCode() != null) {
                System.err.println("Status Code: " + e.getStatusCode());
            }
            
            // Retourner une erreur 400 avec le message détaillé
            throw new RuntimeException("Erreur lors de la création de la session de paiement Stripe: " + e.getMessage(), e);
        } catch (Exception e) {
            // Logger les autres erreurs
            e.printStackTrace();
            System.err.println("Erreur inattendue lors de la création de la session de paiement: " + e.getMessage());
            
            throw new RuntimeException("Erreur inattendue lors de la création de la session de paiement: " + e.getMessage(), e);
        }
    }
}

