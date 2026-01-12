import api from './api';
import type { Track } from '../types/track';

export const trackService = {
  async getTracks(): Promise<Track[]> {
    const { data } = await api.get<Track[]>('/tracks');
    return data;
  },
};

