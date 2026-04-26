import apiClient from "./client";
import type { DashboardAnalytics } from "@/types/api";

export const analyticsApi = {
  getDashboard: async (params?: {
    from?: string;
    to?: string;
    branchId?: string;
  }): Promise<DashboardAnalytics> => {
    const searchParams = new URLSearchParams();
    if (params?.from) searchParams.append("from", params.from);
    if (params?.to) searchParams.append("to", params.to);
    if (params?.branchId) searchParams.append("branchId", params.branchId);
    
    const response = await apiClient.get<DashboardAnalytics>(
      `/analytics/dashboard?${searchParams.toString()}`
    );
    return response.data;
  },
};

export const exportsApi = {
  products: async (): Promise<Blob> => {
    const response = await apiClient.get("/exports/products", {
      responseType: "blob",
    });
    return response.data;
  },

  customers: async (): Promise<Blob> => {
    const response = await apiClient.get("/exports/customers", {
      responseType: "blob",
    });
    return response.data;
  },

  inventory: async (): Promise<Blob> => {
    const response = await apiClient.get("/exports/inventory", {
      responseType: "blob",
    });
    return response.data;
  },
};

export const importsApi = {
  products: async (file: File): Promise<{ imported: number; failed: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await apiClient.post("/imports/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  customers: async (file: File): Promise<{ imported: number; failed: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await apiClient.post("/imports/customers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  suppliers: async (file: File): Promise<{ imported: number; failed: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await apiClient.post("/imports/suppliers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};