package com.prodify.api.service;

import com.prodify.api.model.Order;
import com.prodify.api.model.OrderItem;
import com.prodify.api.repository.OrderRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Transactional
    public Session createCheckoutSession(UUID orderId) throws StripeException {
        // 1. Recharger l'Order depuis la BDD dans la transaction courante
        // Cela garantit que l'objet est attaché à la session Hibernate
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable avec l'ID: " + orderId));

        // 2. Convertir les OrderItems en LineItems Stripe
        List<SessionCreateParams.LineItem> lineItems = order.getItems().stream()
                .map(this::convertToLineItem)
                .collect(Collectors.toList());

        // 2. Créer les paramètres de la session
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/checkout/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/checkout/cancel")
                .addAllLineItem(lineItems)
                .setClientReferenceId(orderId.toString()) // Pour récupérer l'Order ID au webhook
                .putMetadata("order_id", order.getId().toString()) // Pour identifier l'order après le paiement
                .build();

        // 3. Créer la session Stripe
        return Session.create(params);
    }

    /**
     * Convertit un OrderItem en LineItem Stripe.
     * Important : Stripe attend les prix en centimes (Long), nous avons des BigDecimal en euros.
     * Exemple : 10.00€ -> 1000 centimes
     */
    private SessionCreateParams.LineItem convertToLineItem(OrderItem orderItem) {
        // Convertir BigDecimal (euros) en Long (centimes)
        // Exemple : 10.50€ -> 1050 centimes
        BigDecimal priceInEuros = orderItem.getPrice();
        long priceInCents = priceInEuros.multiply(BigDecimal.valueOf(100)).longValue();

        return SessionCreateParams.LineItem.builder()
                .setQuantity(1L)
                .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("eur")
                                .setUnitAmount(priceInCents)
                                .setProductData(
                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                .setName(orderItem.getTrack().getTitle())
                                                .setDescription("Instrumentale - " + orderItem.getTrack().getTitle())
                                                .build()
                                )
                                .build()
                )
                .build();
    }
}

