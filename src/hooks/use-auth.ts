"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import type { UserRole } from "@/types/api";

export function useAuth() {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    login: storeLogin, 
    logout: storeLogout,
    hasRole 
  } = useAuthStore();

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
    login: storeLogin,
    logout,
    checkPermission,
  };
}