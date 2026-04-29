import apiClient from "./client";
import type { 
  Product, 
  ProductFilters, 
  PaginatedResponse,
  CompositeItem 
} from "@/types/api";

export type { Product };

export const productsApi = {
  list: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.barcode) params.append("barcode", filters.barcode);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products?${params.toString()}`
    );
    return response.data;
  },

  get: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<Product>("/products", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  createComposite: async (data: {
    name: string;
    sku: string;
    price: number;
    compositeParent: CompositeItem[];
  }): Promise<Product> => {
    const response = await apiClient.post<Product>("/products/composite", data);
    return response.data;
  },

  getCompositeInventory: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/composite/${id}/inventory`);
    return response.data;
  },

  searchByBarcode: async (barcode: string): Promise<Product | null> => {
    const response = await apiClient.get<Product>(`/products?barcode=${encodeURIComponent(barcode)}`);
    return response.data || null;
  },
};