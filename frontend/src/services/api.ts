import axios from 'axios';
import type { ApiResponse, Order, OrderStatus } from '../types/order';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchOrders = async (params?: {
  status?: string;
  search?: string;
}): Promise<Order[]> => {
  const response = await apiClient.get<ApiResponse<Order[]>>('/orders', { params });
  if (!response.data.success) {
    throw new Error(response.data.error?.message ?? 'Failed to fetch orders');
  }
  return response.data.data ?? [];
};

export const fetchOrderById = async (id: string | number): Promise<Order> => {
  const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error?.message ?? 'Failed to fetch order');
  }
  return response.data.data;
};

export const createOrder = async (payload: {
  orderId: string;
  customerName: string;
  status: OrderStatus;
  totalPrice: number;
}): Promise<Order> => {
  const response = await apiClient.post<ApiResponse<Order>>('/orders', payload);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error?.message ?? 'Failed to create order');
  }
  return response.data.data;
};
