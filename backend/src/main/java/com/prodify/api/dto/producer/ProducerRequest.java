package com.prodify.api.dto.producer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProducerRequest {
    
    // Le nom d'artiste (ex: "DJ Snake")
    private String displayName;
    
    // La petite bio
    private String bio;
    
    // L'avatar viendra plus tard avec l'upload d'image
}