"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, initializeAuth } from "@/stores/auth-store";
import { AppShell } from "@/components/layout/app-shell";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeAuth();
    setMounted(true);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const isAdminRoute = pathname.startsWith("/admin");
    const isManagerRoute = pathname.startsWith("/manager");
    const isSalesRoute = pathname.startsWith("/pos") || pathname.startsWith("/sales");

    if (isAdminRoute && user?.role !== "ADMIN") {
      router.push("/403");
    } else if (isManagerRoute && !["ADMIN", "MANAGER"].includes(user?.role || "")) {
      router.push("/403");
    } else if (isSalesRoute && !["ADMIN", "MANAGER", "SALES_REP"].includes(user?.role || "")) {
      router.push("/403");
    }
  }, [isAuthenticated, user, pathname, router, initialized]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}