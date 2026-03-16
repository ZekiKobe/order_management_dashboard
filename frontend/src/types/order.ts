export type OrderStatus = 'Pending' | 'Completed';

export interface Order {
  id: number;
  orderId: string;
  customerName: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

