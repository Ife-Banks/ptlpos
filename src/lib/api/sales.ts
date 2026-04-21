import apiClient from "./client";
import type { 
  Sale, 
  CreateSaleItem, 
  CompleteSaleRequest,
  PaginatedResponse 
} from "@/types/api";

export const salesApi = {
  create: async (data: {
    customerId?: string;
    branchId?: string;
    items?: CreateSaleItem[];
  }): Promise<Sale> => {
    const response = await apiClient.post<Sale>("/sales", data);
    return response.data;
  },

  get: async (id: string): Promise<Sale> => {
    const response = await apiClient.get<Sale>(`/sales/${id}`);
    return response.data;
  },

  list: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Sale>> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    
    const response = await apiClient.get<PaginatedResponse<Sale>>(
      `/sales?${searchParams.toString()}`
    );
    return response.data;
  },

  addItem: async (saleId: string, item: CreateSaleItem): Promise<Sale> => {
    const response = await apiClient.post<Sale>(`/sales/${saleId}/items`, item);
    return response.data;
  },

  removeItem: async (saleId: string, itemId: string): Promise<Sale> => {
    const response = await apiClient.delete<Sale>(`/sales/${saleId}/items/${itemId}`);
    return response.data;
  },

  hold: async (saleId: string): Promise<Sale> => {
    const response = await apiClient.post<Sale>(`/sales/${saleId}/hold`);
    return response.data;
  },

  resume: async (saleId: string): Promise<Sale> => {
    const response = await apiClient.post<Sale>(`/sales/${saleId}/resume`);
    return response.data;
  },

  complete: async (saleId: string, data: CompleteSaleRequest): Promise<Sale> => {
    const response = await apiClient.post<Sale>(`/sales/${saleId}/complete`, data);
    return response.data;
  },

  cancel: async (saleId: string): Promise<Sale> => {
    const response = await apiClient.post<Sale>(`/sales/${saleId}/cancel`);
    return response.data;
  },

  refund: async (saleId: string, data: { reason?: string }): Promise<Sale> => {
    const response = await apiClient.post<Sale>(`/sales/${saleId}/refund`, data);
    return response.data;
  },

  getReceipt: async (saleId: string): Promise<Sale> => {
    const response = await apiClient.get<Sale>(`/sales/${saleId}/receipt`);
    return response.data;
  },

  getPrintReceipt: async (saleId: string): Promise<string> => {
    const response = await apiClient.get<string>(`/sales/${saleId}/receipt/print`);
    return response.data;
  },
};