import apiClient from "./client";
import type { PaginatedResponse } from "@/types/api";

// ===========================================
// TENANT TYPES
// ===========================================

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  createdAt: string;
  updatedAt: string;
}

export interface TenantUsage {
  tenantId: string;
  users: number;
  branches: number;
  products: number;
  stores: number;
  storage: number;
}

// ===========================================
// SUBSCRIPTION PLAN TYPES
// ===========================================

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: "MONTHLY" | "YEARLY";
  limits: Record<string, number>;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  tenant?: Tenant;
  planId: string;
  plan?: SubscriptionPlan;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// SUPPORT TICKET TYPES
// ===========================================

export interface SupportTicket {
  id: string;
  tenantId: string;
  tenant?: Tenant;
  userId: string;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  category: "TECHNICAL" | "BILLING" | "ACCOUNT" | "FEATURE_REQUEST";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// ANALYTICS TYPES
// ===========================================

export interface AdminAnalytics {
  tenants: {
    total: number;
    active: number;
  };
  subscriptions: {
    total: number;
    active: number;
  };
  support: {
    openTickets: number;
  };
  revenue: number;
}

// ===========================================
// ADMIN API
// ===========================================

export const adminApi = {
  // Tenant Management
  listTenants: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<Tenant>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.status) searchParams.append("status", params.status);
    if (params?.search) searchParams.append("search", params.search);
    const response = await apiClient.get<PaginatedResponse<Tenant>>(`/admin/tenants?${searchParams.toString()}`);
    return response.data;
  },

  getTenant: async (id: string): Promise<Tenant> => {
    const response = await apiClient.get<Tenant>(`/admin/tenants/${id}`);
    return response.data;
  },

  updateTenantStatus: async (id: string, data: { status: string; reason?: string }): Promise<Tenant> => {
    const response = await apiClient.put<Tenant>(`/admin/tenants/${id}/status`, data);
    return response.data;
  },

  getTenantUsage: async (id: string): Promise<TenantUsage> => {
    const response = await apiClient.get<TenantUsage>(`/admin/tenants/${id}/usage`);
    return response.data;
  },

  // Subscription Plans
  listPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.get<SubscriptionPlan[]>("/admin/plans");
    return response.data;
  },

  createPlan: async (data: {
    name: string;
    description: string;
    price: number;
    billingCycle: "MONTHLY" | "YEARLY";
    limits: Record<string, number>;
    features: string[];
    isActive?: boolean;
  }): Promise<SubscriptionPlan> => {
    const response = await apiClient.post<SubscriptionPlan>("/admin/plans", data);
    return response.data;
  },

  getPlan: async (id: string): Promise<SubscriptionPlan> => {
    const response = await apiClient.get<SubscriptionPlan>(`/admin/plans/${id}`);
    return response.data;
  },

  updatePlan: async (id: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    const response = await apiClient.put<SubscriptionPlan>(`/admin/plans/${id}`, data);
    return response.data;
  },

  deletePlan: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/plans/${id}`);
  },

  // Subscriptions
  listSubscriptions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Subscription>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.status) searchParams.append("status", params.status);
    const response = await apiClient.get<PaginatedResponse<Subscription>>(`/admin/subscriptions?${searchParams.toString()}`);
    return response.data;
  },

  getSubscription: async (id: string): Promise<Subscription> => {
    const response = await apiClient.get<Subscription>(`/admin/subscriptions/${id}`);
    return response.data;
  },

  updateSubscription: async (id: string, data: { planId: string }): Promise<Subscription> => {
    const response = await apiClient.put<Subscription>(`/admin/subscriptions/${id}`, data);
    return response.data;
  },

  // Support Tickets
  listTickets: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<PaginatedResponse<SupportTicket>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.status) searchParams.append("status", params.status);
    if (params?.priority) searchParams.append("priority", params.priority);
    if (params?.search) searchParams.append("search", params.search);
    const response = await apiClient.get<PaginatedResponse<SupportTicket>>(`/admin/tickets?${searchParams.toString()}`);
    return response.data;
  },

  getTicket: async (id: string): Promise<SupportTicket> => {
    const response = await apiClient.get<SupportTicket>(`/admin/tickets/${id}`);
    return response.data;
  },

  createTicket: async (data: {
    tenantId: string;
    userId: string;
    subject: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    category: "TECHNICAL" | "BILLING" | "ACCOUNT" | "FEATURE_REQUEST";
  }): Promise<SupportTicket> => {
    const response = await apiClient.post<SupportTicket>("/admin/tickets", data);
    return response.data;
  },

  assignTicket: async (id: string, data: { assignedTo: string }): Promise<SupportTicket> => {
    const response = await apiClient.put<SupportTicket>(`/admin/tickets/${id}/assign`, data);
    return response.data;
  },

  updateTicketStatus: async (id: string, data: { status: string }): Promise<SupportTicket> => {
    const response = await apiClient.put<SupportTicket>(`/admin/tickets/${id}/status`, data);
    return response.data;
  },

  // Analytics
  getOverview: async (): Promise<AdminAnalytics> => {
    const response = await apiClient.get<AdminAnalytics>("/admin/analytics/overview");
    return response.data;
  },

  getUsageAnalytics: async (params?: { period?: string }): Promise<unknown> => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    const response = await apiClient.get(`/admin/analytics/usage?${searchParams.toString()}`);
    return response.data;
  },

  getRevenueAnalytics: async (params?: { period?: string }): Promise<unknown> => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    const response = await apiClient.get(`/admin/analytics/revenue?${searchParams.toString()}`);
    return response.data;
  },
};