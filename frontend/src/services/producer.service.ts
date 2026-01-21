import api from './api';
import type { Producer } from '../types/track';

export const producerService = {
  async getMyProducer(): Promise<Producer> {
    const { data } = await api.get<Producer>('/producers/me');
    return data;
  },

  async getProducerBySlug(slug: string): Promise<Producer> {
    const { data } = await api.get<Producer>(`/producers/slug/${slug}`);
    return data;
  },
};
