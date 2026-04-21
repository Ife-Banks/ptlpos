"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { authApi } from "@/lib/api/auth";
import type { LoginCredentials, RegisterData, UserRole } from "@/types/api";

export function useAuth() {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login: storeLogin, 
    logout: storeLogout,
    setLoading,
    hasRole 
  } = useAuthStore();

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      storeLogin(
        { access_token: response.access_token, refresh_token: response.refresh_token },
        response.user
      );
      
      switch (response.user.role) {
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        case "MANAGER":
          router.push("/manager/dashboard");
          break;
        case "SALES_REP":
          router.push("/pos");
          break;
        default:
          router.push("/");
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [storeLogin, router, setLoading]);

  const register = useCallback(async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await authApi.register(data);
      storeLogin(
        { access_token: response.access_token, refresh_token: response.refresh_token },
        response.user
      );
      router.push("/onboarding");
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [storeLogin, router, setLoading]);

  const logout = useCallback(() => {
    storeLogout();
    router.push("/login");
  }, [storeLogout, router]);

  const checkPermission = useCallback((roles: UserRole[]) => {
    return hasRole(roles);
  }, [hasRole]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkPermission,
  };
}