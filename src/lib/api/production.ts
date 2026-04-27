import apiClient from "./client";

export const productionApi = {
  run: async (data: { productId: string; quantity: number }): Promise<void> => {
    await apiClient.post("/production/run", data);
  },
  getOrders: async () => {
    try {
      const response = await apiClient.get("/production/orders");
      return response.data;
    } catch {
      return null;
    }
  },
  getMaterials: async () => {
    try {
      const response = await apiClient.get("/production/materials");
      return response.data;
    } catch {
      return null;
    }
  },
  getMachines: async () => {
    try {
      const response = await apiClient.get("/production/machines");
      return response.data;
    } catch {
      return null;
    }
  },
};