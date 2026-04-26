import apiClient from "./client";

export interface PaymentReconciliation {
  totalSales: number;
  totalRefunds: number;
  netTotal: number;
  paymentsByMethod: { method: string; amount: number }[];
}

export interface CashDrawer {
  expected: number;
  counted: number;
  variance: number;
}

export const paymentsApi = {
  getReconciliation: async (params?: {
    from?: string;
    to?: string;
  }): Promise<PaymentReconciliation> => {
    const searchParams = new URLSearchParams();
    if (params?.from) searchParams.append("from", params.from);
    if (params?.to) searchParams.append("to", params.to);
    const response = await apiClient.get<PaymentReconciliation>(`/payments/reconciliation?${searchParams.toString()}`);
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
    const response = await apiClient.get<CashDrawer>(`/payments/cash-drawer?${searchParams.toString()}`);
    return response.data;
  },

  create: async (data: {
    saleId: string;
    method: "CASH" | "CARD" | "OTHER";
    amount: number;
    direction: "SALE" | "REFUND";
  }): Promise<void> => {
    await apiClient.post("/payments", data);
  },
};