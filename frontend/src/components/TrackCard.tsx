import { Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types/track';

interface TrackCardProps {
  track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const isActive = currentTrack?.id === track.id && isPlaying;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg transition transform hover:-translate-y-1 hover:shadow-slate-900/50">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={track.coverImageUrl}
          alt={track.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => playTrack(track)}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span className="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-emerald-400">
            <Play size={18} />
            {isActive ? 'Playing' : 'Play'}
          </span>
        </button>
      </div>

      <div className="space-y-1 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-emerald-400">
          {track.genre || 'Genre'}
          {track.bpm ? ` · ${track.bpm} BPM` : ''}
        </p>
        <h3 className="text-lg font-semibold text-white truncate">{track.title}</h3>
        <p className="text-sm text-slate-400">Prod. {track.producer?.displayName || 'Unknown'}</p>
        <p className="text-md font-semibold text-emerald-400">{track.price.toFixed(2)} €</p>
      </div>
    </div>
  );
}

