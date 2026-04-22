"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className={cn(
        "w-full max-w-md border rounded-xl shadow-lg p-8",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <div className="flex flex-col items-center text-center">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4",
            isDark ? "bg-emerald-900/30" : "bg-emerald-100"
          )}>
            <CheckCircle className={cn("w-6 h-6", isDark ? "text-emerald-400" : "text-emerald-600")} />
          </div>
          <h1 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>Check your email</h1>
          <p className={cn("text-sm mb-6", isDark ? "text-gray-400" : "text-gray-500")}>
            We've sent password reset instructions to <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{email}</span>
          </p>
          <Link href="/login" className={cn("text-sm hover:underline", isDark ? "text-blue-400" : "text-blue-600")}>
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full max-w-md border rounded-xl shadow-lg p-8",
      isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-[#003D9B] dark:bg-[#0066FF] rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <h1 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>Forgot password</h1>
        <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
          Enter your email and we'll send you reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className={cn("p-3 text-sm rounded-md", isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600")}>
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className={isDark ? "text-gray-300" : "text-gray-700"}>Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200"}
          />
        </div>

        <Button 
          type="submit" 
          className={cn("w-full bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90")}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>

        <p className={cn("text-sm text-center", isDark ? "text-gray-400" : "text-gray-500")}>
          Remember your password?{" "}
          <Link href="/login" className="text-[#003D9B] dark:text-[#0066FF] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>

      <div className={cn("mt-6 pt-6 border-t flex justify-center gap-4 text-xs", isDark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400")}>
        <Link href="#" className={isDark ? "hover:text-blue-400" : "hover:text-blue-600"}>Privacy Policy</Link>
        <Link href="#" className={isDark ? "hover:text-blue-400" : "hover:text-blue-600"}>Terms of Service</Link>
      </div>
    </div>
  );
}