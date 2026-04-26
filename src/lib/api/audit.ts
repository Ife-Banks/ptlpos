import apiClient from "./client";
import type { PaginatedResponse } from "@/types/api";

export interface AuditLog {
  id: string;
  userId: string;
  userName?: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "PATCH";
  entity: string;
  entityId?: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export const auditApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    entity?: string;
    from?: string;
    to?: string;
  }): Promise<PaginatedResponse<AuditLog>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.action) searchParams.append("action", params.action);
    if (params?.entity) searchParams.append("entity", params.entity);
    if (params?.from) searchParams.append("from", params.from);
    if (params?.to) searchParams.append("to", params.to);
    const response = await apiClient.get<PaginatedResponse<AuditLog>>(`/audit?${searchParams.toString()}`);
    return response.data;
  },
};