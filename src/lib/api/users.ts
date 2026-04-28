import apiClient from "./client";
import type { User, PaginatedResponse } from "@/types/api";

export const usersApi = {
  list: async (params?: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.role) searchParams.append("role", params.role);
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    
    const response = await apiClient.get<User[]>(
      `/users?${searchParams.toString()}`
    );
    const data = response.data || [];
    const total = data.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  get: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> => {
    const response = await apiClient.post<User>("/users", data);
    return response.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  requestEmailVerification: async (userId: string): Promise<void> => {
    await apiClient.post("/auth/email/verify-request", { userId });
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post("/auth/email/verify", { token });
  },
};