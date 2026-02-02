import { Pause, Play, SkipForward, Volume2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${secs}`;
}

export default function AudioPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, progress, togglePlay, seek, setVolume } =
    usePlayer();

  if (!currentTrack) return null;

  const handleSkipForward = () => {
    if (!duration) return;
    seek(Math.min(currentTime + 5, duration));
  };

  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-slate-800 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <img
            src={currentTrack.coverImageUrl}
            alt={currentTrack.title}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div>
            <p className="text-sm text-emerald-400">{currentTrack.producer?.displayName}</p>
            <p className="font-semibold">{currentTrack.title}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              className="rounded-full bg-emerald-500 p-3 text-white shadow hover:bg-emerald-400"
              onClick={() => void togglePlay()}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-700 p-2 text-slate-200 hover:border-emerald-500 hover:text-emerald-400"
              onClick={handleSkipForward}
            >
              <SkipForward size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="w-10 text-right font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={duration ? currentTime : 0}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 cursor-pointer accent-emerald-500"
            />
            <span className="w-10 font-mono">{formatTime(duration)}</span>
          </div>
          <div className="h-1 w-full rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="text-slate-200" size={18} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            defaultValue={1}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
