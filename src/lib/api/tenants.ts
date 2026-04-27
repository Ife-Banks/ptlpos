import apiClient from "./client";
import type { Tenant } from "@/types/api";
interface TaxConfig { vatInclusive: boolean; taxRate: number; }
interface TenantSettings { id: string; name: string; taxConfig: TaxConfig; }
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

  getSettings: async (): Promise<TenantSettings> => {
    const response = await apiClient.get<Tenant>("/tenants/me");
    return { id: response.data.id, name: response.data.name, taxConfig: response.data.taxConfig || { vatInclusive: false, taxRate: 7.5 } };
  },
};