package com.prodify.api.service;

import com.prodify.api.dto.auth.AuthenticationRequest;
import com.prodify.api.dto.auth.AuthenticationResponse;
import com.prodify.api.dto.auth.RegisterRequest;
import com.prodify.api.model.Role;
import com.prodify.api.model.User;
import com.prodify.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // On injecte notre nouveau service
    private final AuthenticationManager authenticationManager; // Pour vérifier le login

    // Méthode Inscription (existante, on change juste le type de retour pour renvoyer le token direct !)
    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);
        
        // On génère le token dès l'inscription pour que l'user soit connecté direct
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    // Méthode Connexion (Nouvelle !)
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Cette ligne fait tout le travail : vérifie email ET mot de passe
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Si on arrive ici, c'est que le user est authentifié, on cherche ses infos
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        // On génère son badge d'accès
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder().token(jwtToken).build();
    }
}