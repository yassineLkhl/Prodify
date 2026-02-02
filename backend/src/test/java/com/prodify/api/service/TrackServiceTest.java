package com.prodify.api.service;

import com.prodify.api.dto.track.TrackRequest;
import com.prodify.api.model.Producer;
import com.prodify.api.model.Track;
import com.prodify.api.model.User;
import com.prodify.api.repository.ProducerRepository;
import com.prodify.api.repository.TrackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrackServiceTest {

    @Mock
    private TrackRepository trackRepository;

    @Mock
    private ProducerRepository producerRepository;

    @InjectMocks
    private TrackService trackService;

    private User testUser;
    private Producer testProducer;
    private TrackRequest trackRequest;

    @BeforeEach
    void setUp() {
        // Initialiser les objets de test
        testUser = User.builder()
                .id(UUID.randomUUID())
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .build();

        testProducer = Producer.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .displayName("John Beat Maker")
                .slug("john-beat-maker")
                .build();

        trackRequest = TrackRequest.builder()
                .title("Mon Titre Incroyable")
                .description("Une description")
                .price(BigDecimal.valueOf(29.99))
                .bpm(140)
                .genre("Trap")
                .mood("Dark")
                .coverImageUrl("https://example.com/cover.jpg")
                .audioUrl("https://example.com/audio.mp3")
                .build();
    }

    @Test
    void createTrack_Success() {
        // Arrange
        when(producerRepository.findByUserId(testUser.getId()))
                .thenReturn(Optional.of(testProducer));

        when(trackRepository.existsBySlug(anyString()))
                .thenReturn(false); // Le slug n'existe pas encore

        Track expectedTrack = Track.builder()
                .title(trackRequest.getTitle())
                .slug("mon-titre-incroyable")
                .description(trackRequest.getDescription())
                .price(trackRequest.getPrice())
                .bpm(trackRequest.getBpm())
                .genre(trackRequest.getGenre())
                .mood(trackRequest.getMood())
                .coverImageUrl(trackRequest.getCoverImageUrl())
                .audioUrl(trackRequest.getAudioUrl())
                .producer(testProducer)
                .isSold(false)
                .build();

        when(trackRepository.save(any(Track.class)))
                .thenReturn(expectedTrack);

        // Act
        Track createdTrack = trackService.createTrack(testUser, trackRequest);

        // Assert
        assertThat(createdTrack)
                .isNotNull()
                .satisfies(track -> {
                    assertThat(track.getTitle()).isEqualTo(trackRequest.getTitle());
                    assertThat(track.getSlug()).isEqualTo("mon-titre-incroyable");
                    assertThat(track.getPrice()).isEqualTo(trackRequest.getPrice());
                    assertThat(track.getProducer()).isEqualTo(testProducer);
                    assertThat(track.isSold()).isFalse();
                });

        // Vérifier que save a été appelé une fois
        verify(trackRepository, times(1)).save(any(Track.class));
        verify(producerRepository, times(1)).findByUserId(testUser.getId());
    }

    @Test
    void createTrack_SlugExists() {
        // Arrange
        when(producerRepository.findByUserId(testUser.getId()))
                .thenReturn(Optional.of(testProducer));

        // Le slug "mon-titre-incroyable" existe déjà
        when(trackRepository.existsBySlug("mon-titre-incroyable"))
                .thenReturn(true);

        // Mock pour le suffixe ajouté
        Track expectedTrackWithSuffix = Track.builder()
                .title(trackRequest.getTitle())
                .slug("mon-titre-incroyable-1234") // Slug avec suffixe
                .description(trackRequest.getDescription())
                .price(trackRequest.getPrice())
                .bpm(trackRequest.getBpm())
                .genre(trackRequest.getGenre())
                .mood(trackRequest.getMood())
                .coverImageUrl(trackRequest.getCoverImageUrl())
                .audioUrl(trackRequest.getAudioUrl())
                .producer(testProducer)
                .isSold(false)
                .build();

        when(trackRepository.save(any(Track.class)))
                .thenReturn(expectedTrackWithSuffix);

        // Act
        Track createdTrack = trackService.createTrack(testUser, trackRequest);

        // Assert
        assertThat(createdTrack).isNotNull();
        // Vérifier que le slug contient le suffixe (format: "base-slug-{timestamp}")
        assertThat(createdTrack.getSlug())
                .startsWith("mon-titre-incroyable-")
                .isNotEqualTo("mon-titre-incroyable");

        // Vérifier que les vérifications et save ont eu lieu
        verify(trackRepository, times(1)).existsBySlug("mon-titre-incroyable");
        verify(trackRepository, times(1)).save(any(Track.class));
    }

    @Test
    void createTrack_ProducerNotFound() {
        // Arrange
        when(producerRepository.findByUserId(testUser.getId()))
                .thenReturn(Optional.empty()); // Le producteur n'existe pas

        // Act & Assert
        assertThatThrownBy(() -> trackService.createTrack(testUser, trackRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("profil producteur");

        // Vérifier que save n'a pas été appelé
        verify(trackRepository, never()).save(any(Track.class));
    }

    @Test
    void getTrackById_Success() {
        // Arrange
        UUID trackId = UUID.randomUUID();
        Track track = Track.builder()
                .id(trackId)
                .title("Test Track")
                .slug("test-track")
                .price(BigDecimal.valueOf(19.99))
                .producer(testProducer)
                .build();

        when(trackRepository.findById(trackId))
                .thenReturn(Optional.of(track));

        // Act
        Track foundTrack = trackService.getTrackById(trackId);

        // Assert
        assertThat(foundTrack)
                .isNotNull()
                .isEqualTo(track);

        verify(trackRepository, times(1)).findById(trackId);
    }

    @Test
    void getTrackById_NotFound() {
        // Arrange
        UUID trackId = UUID.randomUUID();
        when(trackRepository.findById(trackId))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> trackService.getTrackById(trackId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("introuvable");
    }
}
