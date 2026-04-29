import apiClient from "./client";
import type { PaginatedResponse } from "@/types/api";

export interface Shift {
  id: string;
  userId: string;
  userName?: string;
  branchId: string;
  branchName?: string;
  status: "OPEN" | "CLOSED";
  openingBalance: number;
  closingBalance?: number;
  expectedCash?: number;
  actualCash?: number;
  discrepancy?: number;
  drawerType: "ONLINE" | "OFFLINE" | "MIXED";
  notes?: string;
  openedAt: string;
  closedAt?: string;
  createdAt: string;
}

export interface EndOfDayReport {
  date: string;
  shifts: Shift[];
  totals: {
    totalSales: number;
    totalRevenue: number;
    cashSales: number;
    cardSales: number;
  };
}

export interface EndOfShiftReport {
  shift: Shift;
  sales: Array<{
    id: string;
    total: number;
    paymentMethod: string;
    createdAt: string;
  }>;
  payments: Record<string, number>;
  reconciliation?: {
    expectedCash: number;
    actualCash: number;
    discrepancy: number;
  };
}

export interface SalesPerformanceReport {
  period: { from: string; to: string };
  users: Array<{
    userId: string;
    userName: string;
    totalSales: number;
    totalRevenue: number;
  }>;
  totals: {
    totalSales: number;
    totalRevenue: number;
  };
}

export const shiftsApi = {
  list: async (params?: {
    status?: string;
    fromDate?: string;
    toDate?: string;
    branchId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Shift>> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.fromDate) searchParams.append("fromDate", params.fromDate);
    if (params?.toDate) searchParams.append("toDate", params.toDate);
    if (params?.branchId) searchParams.append("branchId", params.branchId);
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    
    const response = await apiClient.get<Shift[]>(`/shifts?${searchParams.toString()}`);
    const data = response.data || [];
    const total = data.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  getActive: async (): Promise<Shift[]> => {
    const response = await apiClient.get<Shift[]>("/shifts/active");
    return response.data || [];
  },

  get: async (id: string): Promise<Shift> => {
    const response = await apiClient.get<Shift>(`/shifts/${id}`);
    return response.data;
  },

  open: async (data: {
    openingBalance: number;
    drawerType: "ONLINE" | "OFFLINE" | "MIXED";
    notes?: string;
  }): Promise<Shift> => {
    const response = await apiClient.post<Shift>("/shifts/open", data);
    return response.data;
  },

  close: async (id: string, data: {
    closingBalance: number;
    notes?: string;
  }): Promise<Shift> => {
    const response = await apiClient.post<Shift>(`/shifts/${id}/close`, data);
    return response.data;
  },

  reconcile: async (id: string, data: {
    actualCash: number;
    actualCard: number;
    actualTransfer: number;
    actualMobile: number;
    notes?: string;
  }): Promise<Shift> => {
    const response = await apiClient.post<Shift>(`/shifts/${id}/reconcile`, data);
    return response.data;
  },

  endOfDay: async (params?: {
    date?: string;
    branchId?: string;
  }): Promise<{
    date: string;
    shifts: Shift[];
    totals: {
      totalSales: number;
      totalRevenue: number;
      cashSales: number;
      cardSales: number;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.append("date", params.date);
    if (params?.branchId) searchParams.append("branchId", params.branchId);
    const response = await apiClient.get(`/shifts/reports/end-of-day?${searchParams.toString()}`);
    return response.data;
  },

  endOfShift: async (shiftId: string): Promise<{
    shift: Shift;
    sales: any[];
    payments: Record<string, number>;
    reconciliation?: {
      expectedCash: number;
      actualCash: number;
      discrepancy: number;
    };
  }> => {
    const response = await apiClient.get(`/shifts/reports/end-of-shift?shiftId=${shiftId}`);
    return response.data;
  },

  salesPerformance: async (params?: {
    userId?: string;
    from?: string;
    to?: string;
    branchId?: string;
  }): Promise<{
    period: { from: string; to: string };
    users: Array<{
      userId: string;
      userName: string;
      totalSales: number;
      totalRevenue: number;
    }>;
    totals: {
      totalSales: number;
      totalRevenue: number;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.append("userId", params.userId);
    if (params?.from) searchParams.append("from", params.from);
    if (params?.to) searchParams.append("to", params.to);
    if (params?.branchId) searchParams.append("branchId", params.branchId);
    const response = await apiClient.get(`/shifts/reports/sales-performance?${searchParams.toString()}`);
    return response.data;
  },
};