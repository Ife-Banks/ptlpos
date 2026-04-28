import apiClient from "./client";
import type { Tenant, TaxConfig, ReceiptSettings } from "@/types/api";

interface TenantSettings { 
  id: string; 
  name: string; 
  taxConfig: TaxConfig;
}

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

  updateTaxSettings: async (taxConfig: Partial<TaxConfig>): Promise<Tenant> => {
    const response = await apiClient.patch<Tenant>("/tenants/me/settings", { taxConfig });
    return response.data;
  },

  getSettings: async (): Promise<TenantSettings> => {
    const response = await apiClient.get<Tenant>("/tenants/me");
    return { 
      id: response.data.id, 
      name: response.data.name, 
      taxConfig: response.data.taxConfig || { vatInclusive: false, taxRate: 7.5 }
    };
  },

  getReceiptSettings: async (): Promise<ReceiptSettings> => {
    const response = await apiClient.get<ReceiptSettings>("/tenants/me/settings/receipt");
    return response.data;
  },

  updateReceiptSettings: async (settings: Partial<ReceiptSettings>): Promise<ReceiptSettings> => {
    const response = await apiClient.patch<ReceiptSettings>("/tenants/me/settings/receipt", settings);
    return response.data;
  },
};