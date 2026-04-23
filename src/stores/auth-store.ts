import { create } from "zustand";
import type { User, UserRole } from "@/types/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  
  setUser: (user: User | null) => void;
  login: (tokens: { access_token: string; refresh_token: string }, user: User) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const ACCESS_TOKEN_KEY = "ptlpos_access_token";
const USER_KEY = "ptlpos_user";

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const userStr = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    // Need both user AND token for valid session
    if (!userStr || !token) return null;
    
    const user = JSON.parse(userStr);
    // Validate user has required fields (check for id or userId)
    if (!user || (!user.id && !user.userId) || !user.role) return null;
    
    return user;
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
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  login: (tokens, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    set({ user: null, isAuthenticated: false });
  },

  hasRole: (roles) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.role);
  },
}));

export const initializeAuth = () => {
  if (typeof window === "undefined") return;
  
  const user = getStoredUser();
  const token = getAccessToken();
  
  // Only set as authenticated if we have valid user AND token
  if (user && token) {
    useAuthStore.setState({ user, isAuthenticated: true });
  } else {
    // Clear any stale data
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    useAuthStore.setState({ user: null, isAuthenticated: false });
  }
};
