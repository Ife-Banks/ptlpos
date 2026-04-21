import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types/api";
import { getAccessToken, getRefreshToken, setTokens, clearTokens, setStoredUser, getStoredUser } from "@/lib/api/client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  login: (tokens: { access_token: string; refresh_token: string }, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hasRole: (roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
        if (user) {
          setStoredUser(user);
        }
      },

      login: (tokens, user) => {
        setTokens(tokens);
        setStoredUser(user);
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false });
      },

      setLoading: (isLoading) => set({ isLoading }),

      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
      },
    }),
    {
      name: "ptlpos-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        const user = getStoredUser();
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        
        if (user && accessToken && refreshToken) {
          state?.setUser(user);
        }
        state?.setLoading(false);
      },
    }
  )
);