package com.prodify.api.controller;

import com.prodify.api.dto.order.CreateOrderRequest;
import com.prodify.api.dto.order.OrderResponse;
import com.prodify.api.model.User;
import com.prodify.api.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody CreateOrderRequest request,
            Authentication authentication
    ) {
        // Récupérer l'utilisateur connecté
        User user = (User) authentication.getPrincipal();

        // Créer la commande
        OrderResponse orderResponse = orderService.createOrder(user, request.getTrackIds());

        return ResponseEntity.ok(orderResponse);
    }
}

