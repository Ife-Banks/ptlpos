"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, initializeAuth } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
import POSTerminalPage from "./page";

export default function POSStandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initializeAuth();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const allowedRoles = ["ADMIN", "MANAGER", "SALES_REP", "SUPPORT_ADMIN", "BILLING_ADMIN"];
    const userRole = user?.role || "";
    if (!allowedRoles.includes(userRole)) {
      router.push("/403");
    }
  }, [isAuthenticated, user, pathname, router, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <POSTerminalPage />;
}