package com.prodify.api.controller;

import com.prodify.api.service.OrderService;
import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentWebhookController {

    private final OrderService orderService;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    /**
     * Endpoint pour recevoir les webhooks de Stripe.
     * Stripe appelle cet endpoint quand un événement important se produit (ex: paiement complété).
     *
     * @param payload Le body de la requête (JSON de l'événement)
     * @param signature Le header Stripe-Signature pour vérifier l'authententicité
     * @return ResponseEntity avec un message de confirmation
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {

        try {
            // 1. Vérifier que la requête vient bien de Stripe
            // Si la signature n'est pas valide, une exception est levée
            Event event = Webhook.constructEvent(payload, signature, webhookSecret);

            log.info("Webhook reçu : type = {}", event.getType());

            // 2. Traiter l'événement en fonction de son type
            switch (event.getType()) {
                case "checkout.session.completed":
                    handleCheckoutSessionCompleted(event);
                    break;

                case "charge.refunded":
                    // On pourrait gérer les remboursements ici
                    log.info("Remboursement reçu");
                    break;

                default:
                    log.info("Événement ignoré : {}", event.getType());
            }

            // 3. Retourner 200 OK pour confirmer à Stripe que le webhook a été reçu
            return ResponseEntity.ok("Webhook reçu avec succès");

        } catch (SignatureVerificationException e) {
            // Signature invalide : c'est une tentative d'attaque ou une erreur
            log.error("Signature Stripe invalide : {}", e.getMessage());
            return ResponseEntity.badRequest().body("Signature invalide");

        } catch (Exception e) {
            // Erreur interne
            log.error("Erreur lors du traitement du webhook Stripe : {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Erreur serveur");
        }
    }

    /**
     * Traite l'événement "checkout.session.completed" de Stripe.
     * Cet événement est déclenché quand un client a complété le paiement avec succès.
     */
    private void handleCheckoutSessionCompleted(Event event) {
        // 1. Extraire la Session depuis l'événement avec fallback pour les mismatch de version
        var dataObjectDeserializer = event.getDataObjectDeserializer();
        var stripeObject = dataObjectDeserializer.getObject()
                .orElseGet(() -> {
                    log.debug("getObject() vide, fallback sur deserializeUnsafe()");
                    try {
                        return dataObjectDeserializer.deserializeUnsafe();
                    } catch (EventDataObjectDeserializationException e) {
                        log.error("Erreur lors de la désérialisation : {}", e.getMessage());
                        throw new RuntimeException("Impossible de désérialiser l'objet Stripe", e);
                    }
                });

        // 2. Vérifier que l'objet est bien une Session
        if (!(stripeObject instanceof Session)) {
            log.error("L'objet Stripe n'est pas une Session : {}", stripeObject.getClass().getName());
            throw new RuntimeException("Objet Stripe invalide : attendu Session");
        }

        Session session = (Session) stripeObject;

        // 3. Récupérer le clientReferenceId (qui est l'Order ID)
        String clientReferenceId = session.getClientReferenceId();
        if (clientReferenceId == null || clientReferenceId.isEmpty()) {
            log.error("clientReferenceId manquant dans la Session Stripe");
            throw new RuntimeException("clientReferenceId manquant");
        }

        // 4. Convertir le clientReferenceId en UUID
        UUID orderId;
        try {
            orderId = UUID.fromString(clientReferenceId);
        } catch (IllegalArgumentException e) {
            log.error("clientReferenceId invalide : {}", clientReferenceId);
            throw new RuntimeException("clientReferenceId invalide");
        }

        // 5. Valider la commande (passer le statut à COMPLETED)
        log.info("Validation de la commande : {}", orderId);
        orderService.validateOrder(orderId);
        log.info("Commande validée avec succès : {}", orderId);
    }
}
