import apiClient from "./client";
import type { 
  InventoryItem, 
  InventoryAdjustment,
  StockTransfer,
  Stocktake,
  PaginatedResponse 
} from "@/types/api";

export const inventoryApi = {
  list: async (params?: {
    branchId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<InventoryItem>> => {
    const searchParams = new URLSearchParams();
    if (params?.branchId) searchParams.append("branchId", params.branchId);
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    
    const response = await apiClient.get<InventoryItem[]>(
      `/inventory?${searchParams.toString()}`
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

  getLowStock: async (threshold?: number): Promise<InventoryItem[]> => {
    const params = threshold ? `?threshold=${threshold}` : "";
    const response = await apiClient.get<InventoryItem[]>(`/inventory/low-stock${params}`);
    return response.data;
  },

  getAlerts: async (): Promise<InventoryItem[]> => {
    const response = await apiClient.get<InventoryItem[]>("/inventory/alerts");
    return response.data;
  },

  adjust: async (data: {
    productId: string;
    branchId: string;
    quantity: number;
    type: "ADJUSTMENT" | "SALE" | "PURCHASE";
    note?: string;
  }): Promise<InventoryAdjustment> => {
    const response = await apiClient.post<InventoryAdjustment>("/inventory/adjust", data);
    return response.data;
  },

  transfer: async (data: {
    fromBranchId: string;
    toBranchId: string;
    items: { productId: string; quantity: number }[];
  }): Promise<StockTransfer> => {
    const response = await apiClient.post<StockTransfer>("/inventory/transfers", data);
    return response.data;
  },

  createStocktake: async (data: {
    name: string;
    branchId: string;
  }): Promise<Stocktake> => {
    const response = await apiClient.post<Stocktake>("/inventory/stocktakes", data);
    return response.data;
  },

  startStocktake: async (id: string): Promise<Stocktake> => {
    const response = await apiClient.post<Stocktake>(`/inventory/stocktakes/${id}/start`);
    return response.data;
  },

  recordCounts: async (id: string, counts: {
    productId: string;
    countedQuantity: number;
  }[]): Promise<Stocktake> => {
    const response = await apiClient.post(
      `/inventory/stocktakes/${id}/record-counts`, 
      { counts }
    );
    return response.data;
  },

  applyStocktake: async (id: string): Promise<Stocktake> => {
    const response = await apiClient.post<Stocktake>(`/inventory/stocktakes/${id}/apply`);
    return response.data;
  },

  getValuation: async (): Promise<{ totalValue: number; totalItems: number }> => {
    const response = await apiClient.get<{ totalValue: number; totalItems: number }>("/inventory/valuation");
    return response.data;
  },

  getHistory: async (params?: {
    productId?: string;
    branchId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<unknown>> => {
    const searchParams = new URLSearchParams();
    if (params?.productId) searchParams.append("productId", params.productId);
    if (params?.branchId) searchParams.append("branchId", params.branchId);
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    const response = await apiClient.get<PaginatedResponse<unknown>>(`/inventory/history?${searchParams.toString()}`);
    return response.data;
  },

  resolveAlert: async (id: string): Promise<void> => {
    await apiClient.post(`/inventory/alerts/${id}/resolve`);
  },
};