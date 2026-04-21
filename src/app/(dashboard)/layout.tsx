"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AppShell } from "@/components/layout/app-shell";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;
    
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
  }, [isAuthenticated, isLoading, user, pathname, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}