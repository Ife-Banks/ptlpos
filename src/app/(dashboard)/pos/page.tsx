"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";

export default function POSPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const userRole = user?.role || "";
    if (!["ADMIN", "MANAGER", "SALES_REP", "SUPPORT_ADMIN", "BILLING_ADMIN"].includes(userRole)) {
      router.push("/403");
      return;
    }
    router.replace("/pos-terminal");
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
    </div>
  );
}