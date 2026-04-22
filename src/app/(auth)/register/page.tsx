"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShoppingCart, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!orgName || !orgEmail) {
        setError("Organization name and email are required");
        return;
      }
      setStep(2);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/admin/dashboard";
    }, 1500);
  };

  return (
    <div className={cn(
      "w-full max-w-4xl border rounded-xl shadow-lg p-8 mx-auto my-12",
      isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-[#003D9B] dark:bg-[#0066FF] rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <h1 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>Create an account</h1>
        <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
          {step === 1 ? "Enter your organization details" : "Create your admin account"}
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <div className={cn("h-2 w-16 rounded-full", step >= 1 ? "bg-[#003D9B] dark:bg-[#0066FF]" : isDark ? "bg-gray-700" : "bg-gray-200")} />
        <div className={cn("h-2 w-16 rounded-full", step >= 2 ? "bg-[#003D9B] dark:bg-[#0066FF]" : isDark ? "bg-gray-700" : "bg-gray-200")} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className={cn("p-3 text-sm rounded-md", isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600")}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="orgName" className={isDark ? "text-gray-300" : "text-gray-700"}>Organization Name *</Label>
              <Input
                id="orgName"
                type="text"
                placeholder="Your company name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                className={isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgEmail" className={isDark ? "text-gray-300" : "text-gray-700"}>Organization Email *</Label>
              <Input
                id="orgEmail"
                type="email"
                placeholder="contact@company.com"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                required
                className={isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgPhone" className={isDark ? "text-gray-300" : "text-gray-700"}>Phone</Label>
              <Input
                id="orgPhone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={orgPhone}
                onChange={(e) => setOrgPhone(e.target.value)}
                className={isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgWebsite" className={isDark ? "text-gray-300" : "text-gray-700"}>Website</Label>
              <Input
                id="orgWebsite"
                type="url"
                placeholder="https://company.com"
                value={orgWebsite}
                onChange={(e) => setOrgWebsite(e.target.value)}
                className={isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200"}
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="userName" className={isDark ? "text-gray-300" : "text-gray-700"}>Full Name *</Label>
              <Input
                id="userName"
                type="text"
                placeholder="John Doe"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className={isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail" className={isDark ? "text-gray-300" : "text-gray-700"}>Email *</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="john@company.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                className={isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={isDark ? "text-gray-300" : "text-gray-700"}>Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className={cn(
                    "pr-10",
                    isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2",
                    isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>Must be at least 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={isDark ? "text-gray-300" : "text-gray-700"}>Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200"}
              />
            </div>
          </>
        )}

        <div className="flex gap-2 pt-2">
          {step === 2 && (
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setStep(1)}
              className={cn("flex-1", isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button 
            type="submit" 
            className={cn("flex-1", "bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90")}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : step === 1 ? (
              <>
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            ) : (
              <>
                Create Account
                <CheckCircle className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        <p className={cn("text-sm text-center pt-2", isDark ? "text-gray-400" : "text-gray-500")}>
          Already have an account?{" "}
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