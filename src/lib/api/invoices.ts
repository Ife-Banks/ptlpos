import apiClient from "./client";
import type { PaginatedResponse } from "@/types/api";

export const invoicesApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Invoice>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.status) searchParams.append("status", params.status);
    
    const response = await apiClient.get<Invoice[]>(
      `/invoices?${searchParams.toString()}`
    );
    const data = response.data || [];
    return { data, total: data.length, page: params?.page || 1, limit: params?.limit || 10, totalPages: Math.ceil(data.length / (params?.limit || 10)) };
  },

  get: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  create: async (data: { saleId: string }): Promise<Invoice> => {
    const response = await apiClient.post<Invoice>("/invoices", data);
    return response.data;
  },

  getA4: async (id: string): Promise<string> => {
    const response = await apiClient.get<string>(`/invoices/${id}/a4`);
    return response.data;
  },
};

export const paymentsApi = {
  getReconciliation: async (params?: {
    from?: string;
    to?: string;
  }): Promise<PaymentReconciliation> => {
    const searchParams = new URLSearchParams();
    if (params?.from) searchParams.append("from", params.from);
    if (params?.to) searchParams.append("to", params.to);
    
    const response = await apiClient.get<PaymentReconciliation>(
      `/payments/reconciliation?${searchParams.toString()}`
    );
    return response.data;
  },

  getCashDrawer: async (params?: {
    from?: string;
    to?: string;
    countedCash?: number;
  }): Promise<CashDrawer> => {
    const searchParams = new URLSearchParams();
    if (params?.from) searchParams.append("from", params.from);
    if (params?.to) searchParams.append("to", params.to);
    if (params?.countedCash) searchParams.append("countedCash", String(params.countedCash));
    
    const response = await apiClient.get<CashDrawer>(
      `/payments/cash-drawer?${searchParams.toString()}`
    );
    return response.data;
  },
};

export interface Invoice {
  id: string;
  invoiceNumber: string;
  saleId: string;
  customer: {
    name: string;
    email?: string;
  };
  amount: number;
  status: "PAID" | "PENDING" | "OVERDUE";
  createdAt: string;
}

export interface PaymentReconciliation {
  totalSales: number;
  totalPayments: number;
  totalCash: number;
  totalCard: number;
  totalPending: number;
}

export interface CashDrawer {
  openingBalance: number;
  cashSales: number;
  cashRefunds: number;
  expected: number;
  counted: number;
  difference: number;
}