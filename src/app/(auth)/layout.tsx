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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [initialized, setInitialized] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only initialize once
    if (!initializedRef.current) {
      initializedRef.current = true;
      initializeAuth();
      // Small delay to ensure state is set
      setTimeout(() => setInitialized(true), 50);
    }
  }, []);

  // Redirect if authenticated (after initialization)
  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [initialized, isAuthenticated, router]);

  // Show loading spinner until initialized
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB] dark:bg-[#0A0A0A]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
      </div>
    );
  }

  // Show login page if not authenticated
  return (
    <div className="min-h-screen bg-[#F7F9FB] dark:bg-[#0A0A0A] transition-colors duration-300">
      {children}
    </div>
  );
}