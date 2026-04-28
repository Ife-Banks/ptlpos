import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { parseJSON } from "@/lib/utils";
import type { ApiError, AuthTokens } from "@/types/api";

const isProduction = process.env.NODE_ENV === "production";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ptlpos.onrender.com/api";

if (!process.env.NEXT_PUBLIC_API_URL && isProduction) {
  console.warn("WARNING: NEXT_PUBLIC_API_URL not set - using default. This is insecure for production!");
}

const ACCESS_TOKEN_KEY = "ptlpos_access_token";
const REFRESH_TOKEN_KEY = "ptlpos_refresh_token";
const USER_KEY = "ptlpos_user";

const logSecurityEvent = (event: string, details: Record<string, unknown>) => {
  if (isProduction) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      type: "security",
      event,
      ...details,
    }));
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (tokens: AuthTokens): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
};

export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("ptlpos_tenant");
};

export const clearAuth = (): void => {
  clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  return parseJSON(userStr, null);
};

export const setStoredUser = (user: unknown): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const url = originalRequest?.url || "unknown";

    if (status === 401 && !originalRequest?._retry) {
      logSecurityEvent("auth_token_expired", { url });
      
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        logSecurityEvent("auth_missing_token", { url });
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;
        localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
        logSecurityEvent("auth_token_refreshed", { url });
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        onTokenRefreshed(access_token);
        isRefreshing = false;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        clearTokens();
        logSecurityEvent("auth_refresh_failed", { url, error: "token_refresh_error" });
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    if (status === 403) {
      logSecurityEvent("api_forbidden", { url, status });
    } else if (status && status >= 500) {
      logSecurityEvent("api_server_error", { url, status });
    }

    return Promise.reject(error);
  }
);

export default apiClient;