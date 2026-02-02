import api from './api';
import type { PaymentResponse } from '../types/payment';

export const paymentService = {
  initiateCheckout: async (orderId: string): Promise<string> => {
    const response = await api.post<PaymentResponse>(`/payment/checkout/${orderId}`);
    return response.data.url;
  },
};
