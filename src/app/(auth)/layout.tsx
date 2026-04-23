"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, initializeAuth } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
  
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [initialized, setInitialized] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initializeAuth();
      setTimeout(() => setInitialized(true), 50);
    }
  }, []);

  useEffect(() => {
    if (initialized && isAuthenticated && user) {
      const role = user.role;
      if (role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (role === "MANAGER") {
        router.replace("/manager/dashboard");
      } else {
        router.replace("/pos-terminal");
      }
    }
  }, [initialized, isAuthenticated, user, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB] dark:bg-[#0A0A0A]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] dark:bg-[#0A0A0A] transition-colors duration-300">
      {children}
    </div>
  );
}