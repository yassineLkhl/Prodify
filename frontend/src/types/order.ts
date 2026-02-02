export interface OrderItemResponse {
  trackId: string;
  trackTitle: string;
  price: number;
}

export interface OrderResponse {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface CreateOrderRequest {
  trackIds: string[];
}
