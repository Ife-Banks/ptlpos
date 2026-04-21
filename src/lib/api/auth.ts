import apiClient from "./client";
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  User 
} from "@/types/api";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await apiClient.post("/auth/refresh", { refresh_token: refreshToken });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post("/auth/email/verify", { token });
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post("/auth/password/reset-request", { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post("/auth/password/reset", { token, newPassword });
  },
};