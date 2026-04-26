import apiClient from "./client";
import type { PaginatedResponse } from "@/types/api";

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoriesApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    q?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Category>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.q) searchParams.append("q", params.q);
    if (params?.isActive !== undefined) searchParams.append("isActive", String(params.isActive));
    const response = await apiClient.get<PaginatedResponse<Category>>(`/categories?${searchParams.toString()}`);
    return response.data;
  },

  get: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description?: string; isActive?: boolean }): Promise<Category> => {
    const response = await apiClient.post<Category>("/categories", data);
    return response.data;
  },

  update: async (id: string, data: { name?: string; description?: string; isActive?: boolean }): Promise<Category> => {
    const response = await apiClient.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};