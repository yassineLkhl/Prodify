package com.prodify.api.dto.track;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TrackRequest {

    private String title;
    private String description;

    // BigDecimal est obligatoire pour l'argent (précision)
    private BigDecimal price;

    private Integer bpm;
    private String genre;
    private String mood;

    // Pour l'instant on envoie des URLs texte (ex: liens Google Drive ou S3)
    private String coverImageUrl;
    private String audioUrl;
}
