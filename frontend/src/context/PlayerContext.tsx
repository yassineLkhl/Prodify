import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Track } from '../types/track';

interface PlayerContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: Track) => Promise<void>;
  togglePlay: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (value: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
      setProgress(ratio);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setProgress(0);
      setCurrentTime(0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = async (track: Track) => {
    let audio = audioRef.current;

    if (!audio) {
      audio = new Audio();
      audioRef.current = audio;
    }

    // Only reload source when switching track
    if (!currentTrack || currentTrack.id !== track.id) {
      audio.src = track.audioUrl;
      audio.currentTime = 0;
      setCurrentTrack(track);
      setProgress(0);
      setCurrentTime(0);
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to play track', err);
    }
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlay = async () => {
    if (!currentTrack) return;

    if (isPlaying) {
      pause();
      return;
    }

    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to resume playback', err);
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current || duration <= 0) return;
    const boundedTime = Math.min(Math.max(time, 0), duration);
    audioRef.current.currentTime = boundedTime;
    setCurrentTime(boundedTime);
    setProgress(duration ? boundedTime / duration : 0);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        currentTime,
        duration,
        volume,
        playTrack,
        togglePlay,
        pause,
        seek,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
