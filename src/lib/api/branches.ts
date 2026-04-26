import apiClient from "./client";
import type { PaginatedResponse } from "@/types/api";

export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const branchesApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Branch>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    const response = await apiClient.get<PaginatedResponse<Branch>>(`/branches?${searchParams.toString()}`);
    return response.data;
  },

  get: async (id: string): Promise<Branch> => {
    const response = await apiClient.get<Branch>(`/branches/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }): Promise<Branch> => {
    const response = await apiClient.post<Branch>("/branches", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Branch>): Promise<Branch> => {
    const response = await apiClient.put<Branch>(`/branches/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/branches/${id}`);
  },
};