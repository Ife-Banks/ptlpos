import apiClient from "./client";
import type { Order, PaginatedResponse } from "@/types/api";

export const ordersApi = {
  list: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Order>> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    
    const response = await apiClient.get<{ data: Order[]; meta: { total: number } }>(
      `/orders?${searchParams.toString()}`
    );
    const data = Array.isArray(response.data.data) ? response.data.data : [];
    const total = response.data.meta?.total || 0;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  get: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  create: async (data: {
    customerId?: string;
    branchId?: string;
    items: { productId: string; quantity: number; unitPrice: number }[];
  }): Promise<Order> => {
    const response = await apiClient.post<Order>("/orders", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Order>): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${id}`, data);
    return response.data;
  },

  cancel: async (id: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/cancel`);
    return response.data;
  },

  fulfill: async (id: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/fulfill`);
    return response.data;
  },
};