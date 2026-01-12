import { useEffect, useState } from 'react';
import TrackCard from '../components/TrackCard';
import { trackService } from '../services/track.service';
import type { Track } from '../types/track';

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await trackService.getTracks();
        setTracks(data);
      } catch (err) {
        setError('Impossible de charger les tracks pour le moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return (
    <div className="px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Catalogue des Beats 🎵</h1>
        <p className="mt-2 text-gray-400">
          Parcours les dernières instrumentales des meilleurs producteurs.
        </p>
      </div>

      {loading && (
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

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  );
}