import { useEffect, useState } from 'react';
import TrackCard from '../components/TrackCard';
import TrackFilters from '../components/TrackFilters';
import { trackService } from '../services/track.service';
import type { Track, TrackSearchCriteria } from '../types/track';

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Charger les tracks au chargement initial
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await trackService.getTracks();
        setTracks(data);
      } catch (err) {
        setError('Impossible de charger les tracks pour le moment.');
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Fonction pour rechercher avec filtres (appelée automatiquement par TrackFilters)
  const handleSearch = async (criteria: TrackSearchCriteria) => {
    try {
      setIsSearching(true);
      setError(null);
      
      // Si aucun critère, afficher toutes les tracks
      if (!Object.values(criteria).some(v => v !== undefined && v !== '')) {
        const data = await trackService.getTracks();
        setTracks(data);
      } else {
        const data = await trackService.searchTracks(criteria);
        setTracks(data);
      }
    } catch (err) {
      setError('Erreur lors de la recherche.');
      setTracks([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Catalogue des Beats 🎵</h1>
        <p className="mt-2 text-gray-400">
          Parcours les dernières instrumentales des meilleurs producteurs.
        </p>
      </div>

      {/* Barre de filtres avec auto-search */}
      <TrackFilters onSearch={handleSearch} isLoading={isSearching} />

      {/* Affichage du contenu */}
      {loading && !isSearching && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-72 rounded-xl border border-slate-800 bg-slate-900/80"
            >
              <div className="h-full animate-pulse rounded-xl bg-slate-800/60" />
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && tracks.length === 0 && (
        <div className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-center text-sm text-blue-200">
          Aucune track trouvée avec ces filtres. Essaye d'ajuster tes critères.
        </div>
      )}

      {!loading && !error && tracks.length > 0 && (
        <>
          <div className="mb-4 text-sm text-slate-400">
            {tracks.length} track{tracks.length > 1 ? 's' : ''} trouvée{tracks.length > 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}