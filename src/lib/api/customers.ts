import apiClient from "./client";
import type { Customer, PaginatedResponse } from "@/types/api";

export const customersApi = {
  list: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Customer>> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    
    const response = await apiClient.get<Customer[]>(
      `/customers?${searchParams.toString()}`
    );
    const data = response.data || [];
    return {
      data,
      total: data.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: Math.ceil(data.length / (params?.limit || 10)),
    };
  },

  get: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  getHistory: async (id: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<unknown>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    
    const response = await apiClient.get<PaginatedResponse<unknown>>(
      `/customers/${id}/history?${searchParams.toString()}`
    );
    return response.data;
  },

  create: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.post<Customer>("/customers", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.patch<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },

  getCredit: async (id: string): Promise<{ balance: number }> => {
    const response = await apiClient.get<{ balance: number }>(`/customers/${id}/credit`);
    return response.data;
  },

  addCredit: async (id: string, data: { amount: number; note?: string }): Promise<Customer> => {
    const response = await apiClient.post<Customer>(`/customers/${id}/credit/add`, data);
    return response.data;
  },

  deductCredit: async (id: string, data: { amount: number; note?: string }): Promise<Customer> => {
    const response = await apiClient.post<Customer>(`/customers/${id}/credit/deduct`, data);
    return response.data;
  },

  getCreditTransactions: async (id: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<unknown>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    const response = await apiClient.get<PaginatedResponse<unknown>>(
      `/customers/${id}/credit/transactions?${searchParams.toString()}`
    );
    return response.data;
  },
};