"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldOff, Home } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

export default function ForbiddenPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4",
      isDark ? "bg-gray-950" : "bg-gray-50"
    )}>
      <div className="text-center max-w-full">
        <div className={cn(
          "mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full",
          isDark ? "bg-red-900/20" : "bg-red-100"
        )}>
          <ShieldOff className={cn("h-12 w-12", isDark ? "text-red-400" : "text-red-600")} />
        </div>
        <h1 className={cn(
          "text-4xl font-bold mb-3",
          isDark ? "text-white" : "text-gray-900"
        )}>
          403
        </h1>
        <h2 className={cn(
          "text-xl font-semibold mb-3",
          isDark ? "text-gray-200" : "text-gray-900"
        )}>
          Access Denied
        </h2>
        <p className={cn(
          "text-base mb-8",
          isDark ? "text-gray-400" : "text-gray-600"
        )}>
          You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex gap-3 justify-center">
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className={cn(
              isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"
            )}
          >
            Go Back
          </Button>
          <Link href="/">
            <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}