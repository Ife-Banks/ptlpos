"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate login - in production this would call useAuth hook
    setTimeout(() => {
      setIsLoading(false);
      // For demo, redirect to dashboard
      window.location.href = "/admin/dashboard";
    }, 1500);
  };

  return (
    <div className="bg-surface-container-lowest border border-border-light rounded-xl shadow-lg p-8">
      {/* Branding */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-4 shadow-sm">
          <ShoppingCart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">PTLPOS</h1>
        <p className="text-sm text-text-muted mt-1">Enterprise Retail Management</p>
      </div>

      {/* Login Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-1">Secure Sign In</h2>
        <p className="text-sm text-text-muted">Enter your credentials to access your terminal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-error bg-error-bg rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showAdvanced && (
          <div className="space-y-2">
            <Label htmlFor="tenantId">Organization ID</Label>
            <Input
              id="tenantId"
              type="text"
              placeholder="Your organization ID"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="remember" 
            className="w-4 h-4 text-primary border-border-light rounded focus:ring-primary" 
          />
          <label htmlFor="remember" className="text-sm text-text-secondary">
            Remember this device
          </label>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <Loader2 className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-light" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface-container-lowest px-4 text-xs text-text-muted">OR</span>
        </div>
      </div>

      {/* Advanced Login */}
      <button 
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between p-3 border border-border-light rounded-lg hover:bg-surface transition-colors group"
      >
        <div className="flex items-center gap-3">
<div className="w-8 h-8 bg-primary-bg rounded-lg flex items-center justify-center">
          <ShoppingCart className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-text-primary">Advanced Login</p>
            <p className="text-xs text-text-muted">Access via Tenant ID</p>
          </div>
        </div>
        <div className={`text-text-muted group-hover:translate-x-1 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}>
          →
        </div>
      </button>

      {/* Footer */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex gap-4 text-xs text-text-muted">
          <Link href="#" className="hover:text-primary">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary">Terms of Service</Link>
          <Link href="#" className="hover:text-primary">Help Center</Link>
        </div>
        <p className="text-xs text-text-muted">© 2024 PTLPOS. All rights reserved.</p>
      </div>
    </div>
  );
}