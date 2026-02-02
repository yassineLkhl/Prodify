import api from './api';
import type { OrderResponse, CreateOrderRequest } from '../types/order';

export const orderService = {
  createOrder: async (trackIds: string[]): Promise<OrderResponse> => {
    const request: CreateOrderRequest = { trackIds };
    const response = await api.post<OrderResponse>('/orders', request);
    return response.data;
  },
};
