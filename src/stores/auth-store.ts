import { create } from "zustand";
import type { User, UserRole } from "@/types/api";

interface TenantInfo {
  id: string;
  name: string;
}

interface AuthState {
  user: User | null;
  tenant: TenantInfo | null;
  isAuthenticated: boolean;
  
  setUser: (user: User | null) => void;
  setTenant: (tenant: TenantInfo | null) => void;
  login: (tokens: { access_token: string; refresh_token: string }, user: User, tenant?: TenantInfo) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const ACCESS_TOKEN_KEY = "ptlpos_access_token";
const REFRESH_TOKEN_KEY = "ptlpos_refresh_token";
const USER_KEY = "ptlpos_user";

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const userStr = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (!userStr || !token) return null;
    
    const user = JSON.parse(userStr);
    if (!user || (!user.id && !user.userId) || !user.role) return null;
    
    return user;
  } catch {
    return null;
  }
};

const getStoredTenant = (): TenantInfo | null => {
  if (typeof window === "undefined") return null;
  try {
    const tenantStr = localStorage.getItem("ptlpos_tenant");
    if (!tenantStr) return null;
    return JSON.parse(tenantStr);
  } catch {
    return null;
  }
};

const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tenant: null,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setTenant: (tenant) => {
    set({ tenant });
  },

  login: (tokens, user, tenant) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (tenant) {
        localStorage.setItem("ptlpos_tenant", JSON.stringify(tenant));
      }
    }
    set({ user, tenant: tenant || null, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem("ptlpos_tenant");
    }
    set({ user: null, tenant: null, isAuthenticated: false });
  },

  hasRole: (roles) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.role as UserRole);
  },
}));

export const initializeAuth = () => {
  if (typeof window === "undefined") return;
  
  const user = getStoredUser();
  const tenant = getStoredTenant();
  const token = getAccessToken();
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (user && token && refreshToken) {
    useAuthStore.setState({ user, tenant, isAuthenticated: true });
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("ptlpos_tenant");
    useAuthStore.setState({ user: null, tenant: null, isAuthenticated: false });
  }
};
