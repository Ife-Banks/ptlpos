import apiClient from "./client";
import type { PaginatedResponse } from "@/types/api";

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplier?: { name: string };
  branchId: string;
  status: "DRAFT" | "SENT" | "PARTIAL" | "RECEIVED" | "CANCELLED";
  items: { productId: string; productName: string; quantity: number; cost: number; receivedQuantity: number }[];
  total: number;
  expectedDate?: string;
  receivedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const purchaseOrdersApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<PurchaseOrder>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.status) searchParams.append("status", params.status);
    const response = await apiClient.get<PaginatedResponse<PurchaseOrder>>(`/purchase-orders?${searchParams.toString()}`);
    return response.data;
  },

  get: async (id: string): Promise<PurchaseOrder> => {
    const response = await apiClient.get<PurchaseOrder>(`/purchase-orders/${id}`);
    return response.data;
  },

  create: async (data: {
    supplierId: string;
    branchId: string;
    items: { productId: string; quantity: number; cost: number }[];
    expectedDate?: string;
  }): Promise<PurchaseOrder> => {
    const response = await apiClient.post<PurchaseOrder>("/purchase-orders", data);
    return response.data;
  },
};