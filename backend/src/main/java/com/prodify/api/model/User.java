package com.prodify.api.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users") // "user" est réservé en SQL, donc "users" obligatoire
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails { // Implémenter UserDetails facilite l'intégration Spring Security

    @Id
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    // Le nom d'artiste ou pseudo (ex: "DJ Snake")
    private String displayName;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore 
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    // --- AUDITING ---
    @PrePersist
    public void onCreate() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = this.createdAt;
        if (this.role == null) {
            this.role = Role.USER; // Rôle par défaut
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    // --- IMPLEMENTATION USER DETAILS (Spring Security) ---
    // Ces méthodes permettent à Spring Security de comprendre ton User
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email; // Notre identifiant est l'email
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true; // On pourra ajouter une confirmation par email plus tard
    }
}