import apiClient from "./client";

export const productionApi = {
  run: async (data: { productId: string; quantity: number }): Promise<void> => {
    await apiClient.post("/production/run", data);
  },
};