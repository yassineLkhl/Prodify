package com.prodify.api.dto.track;

import java.math.BigDecimal;
import lombok.*;

/** DTO pour les critères de recherche et filtrage des tracks. Tous les champs sont optionnels. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackSearchCriteria {

    // Recherche textuelle
    private String title;

    // Filtres de métadonnées musicales
    private String genre;
    private String mood;

    // Filtres de BPM
    private Integer minBpm;
    private Integer maxBpm;

    // Filtres de prix
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}
