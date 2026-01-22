import api from './api';
import type { Track, TrackRequest, TrackSearchCriteria } from '../types/track';

export const trackService = {
  async getTracks(): Promise<Track[]> {
    const { data } = await api.get<Track[]>('/tracks');
    return data;
  },
  async createTrack(data: TrackRequest): Promise<Track> {
    const { data: track } = await api.post<Track>('/tracks', data);
    return track;
  },
  async getTracksByProducer(producerId: string): Promise<Track[]> {
    const { data } = await api.get<Track[]>(`/tracks/producer/${producerId}`);
    return data;
  },
  async getTracksByProducerSlug(slug: string): Promise<Track[]> {
    const { data } = await api.get<Track[]>(`/tracks/producer-slug/${slug}`);
    return data;
  },
  async searchTracks(criteria: TrackSearchCriteria): Promise<Track[]> {
    const { data } = await api.post<Track[]>('/tracks/search', criteria);
    return data;
  },
  async deleteTrack(id: string): Promise<void> {
    await api.delete(`/tracks/${id}`);
  },
  async updateTrack(id: string, data: TrackRequest): Promise<Track> {
    const { data: track } = await api.put<Track>(`/tracks/${id}`, data);
    return track;
  },
};
