package com.prodify.api.specification;

import com.prodify.api.dto.track.TrackSearchCriteria;
import com.prodify.api.model.Track;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.springframework.data.jpa.domain.Specification;

/**
 * Classe utilitaire pour construire les Specifications JPA basées sur les critères de recherche.
 */
public class TrackSpecification {

    private TrackSpecification() {
        // Utilitaire, pas d'instantiation
    }

    /**
     * Construit une Specification dynamique à partir des critères de recherche. Chaque critère
     * présent (non null) génère un prédicat WHERE.
     *
     * @param criteria Les critères de recherche
     * @return Une Specification JPA pour effectuer la requête
     */
    public static Specification<Track> getSpecifications(TrackSearchCriteria criteria) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Recherche par titre (insensible à la casse, partielle)
            if (Objects.nonNull(criteria.getTitle()) && !criteria.getTitle().isBlank()) {
                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("title")),
                                "%" + criteria.getTitle().toLowerCase() + "%"));
            }

            // Filtrer par genre
            if (Objects.nonNull(criteria.getGenre()) && !criteria.getGenre().isBlank()) {
                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("genre")),
                                "%" + criteria.getGenre().toLowerCase() + "%"));
            }

            // Filtrer par mood (humeur)
            if (Objects.nonNull(criteria.getMood()) && !criteria.getMood().isBlank()) {
                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("mood")),
                                "%" + criteria.getMood().toLowerCase() + "%"));
            }

            // Filtrer par BPM minimum
            if (Objects.nonNull(criteria.getMinBpm())) {
                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                                root.get("bpm"), criteria.getMinBpm()));
            }

            // Filtrer par BPM maximum
            if (Objects.nonNull(criteria.getMaxBpm())) {
                predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(root.get("bpm"), criteria.getMaxBpm()));
            }

            // Filtrer par prix minimum
            if (Objects.nonNull(criteria.getMinPrice())) {
                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                                root.get("price"), criteria.getMinPrice()));
            }

            // Filtrer par prix maximum
            if (Objects.nonNull(criteria.getMaxPrice())) {
                predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(
                                root.get("price"), criteria.getMaxPrice()));
            }

            // Combiner tous les prédicats avec AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
