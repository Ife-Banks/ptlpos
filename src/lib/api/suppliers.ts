import apiClient from "./client";
import type { PaginatedResponse } from "@/types/api";

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  createdAt: string;
  updatedAt: string;
}

export const suppliersApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Supplier>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.search) searchParams.append("search", params.search);
    const response = await apiClient.get<Supplier[]>(`/suppliers?${searchParams.toString()}`);
    const data = response.data || [];
    return {
      data,
      total: data.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: Math.ceil(data.length / (params?.limit || 10)),
    };
  },

  get: async (id: string): Promise<Supplier> => {
    const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    contactPerson?: string;
  }): Promise<Supplier> => {
    const response = await apiClient.post<Supplier>("/suppliers", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Supplier>): Promise<Supplier> => {
    const response = await apiClient.patch<Supplier>(`/suppliers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/suppliers/${id}`);
  },
};