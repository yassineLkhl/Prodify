import api from './api';
import type { Track, TrackRequest } from '../types/track';

export const trackService = {
  async getTracks(): Promise<Track[]> {
    const { data } = await api.get<Track[]>('/tracks');
    return data;
  },
  async createTrack(data: TrackRequest): Promise<Track> {
    const { data: track } = await api.post<Track>('/tracks', data);
    return track;
  },
};

