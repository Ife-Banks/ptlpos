import apiClient from "./client";
import type { Tenant } from "@/types/api";

export const tenantsApi = {
  get: async (): Promise<Tenant> => {
    const response = await apiClient.get<Tenant>("/tenants/me");
    return response.data;
  },

  update: async (data: Partial<Tenant>): Promise<Tenant> => {
    const response = await apiClient.patch<Tenant>("/tenants/me", data);
    return response.data;
  },

  updateDetails: async (data: Partial<Tenant>): Promise<Tenant> => {
    const response = await apiClient.patch<Tenant>("/tenants/me/details", data);
    return response.data;
  },
};