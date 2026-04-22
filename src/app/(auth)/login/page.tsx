"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ShoppingCart, ArrowRight, Zap, Shield, Mail, Lock, Check, Building2, Globe, Clock, HeadphonesIcon, UserCog, Users, ShoppingBasket, Sparkles } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/types/api";
import { useTheme } from "@/components/providers/theme-provider";

export default function LoginPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const login = useAuthStore((state) => state.login);
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Clear any existing session on login page mount
  useEffect(() => {
    logout();
    setMounted(true);
  }, [logout]);

  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "MANAGER" | "SALES_REP">("ADMIN");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    const loginAndRedirect = () => {
      const role = selectedRole;
      const roleNames: Record<string, string> = {
        ADMIN: "Sarah Admin",
        MANAGER: "Mike Manager",
        SALES_REP: "John Sales",
      };
      const mockUser: User = {
        id: "1",
        email: email || "demo@ptlpos.com",
        name: roleNames[role] || "Demo User",
        role: role,
        tenantId: tenantId || "DEMO",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const tokens = {
        access_token: "demo-access-token",
        refresh_token: "demo-refresh-token",
      };
      
      login(tokens, mockUser);
      setIsLoading(false);
      
      setTimeout(() => {
        if (role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (role === "MANAGER") {
          router.push("/manager/dashboard");
        } else {
          router.push("/sales/pos");
        }
      }, 150);
    };

    setTimeout(loginAndRedirect, 1500);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB] dark:bg-[#0A0A0A]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
  <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden">
        {/* Dynamic Background */}
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]' : 'bg-gradient-to-br from-[#003D9B] via-[#0052CC] to-[#003D9B]'}`}>
          {/* Animated Shapes */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-40 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-2000" />
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10" 
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
          />
          
          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0066FF]/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">PTLPOS</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Enterprise Retail<br />
            <span className="text-gradient-accent">Management</span>
          </h1>
          <p className="text-2xl text-white/80 mb-6 max-w-full">
            Streamline your operations with powerful multi-branch control, <span className="text-gradient-accent">real-time analytics</span>, and seamless customer experiences.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Building2, title: "Multi-Branch", desc: "Manage unlimited locations" },
              { icon: Globe, title: "Cloud-Based", desc: "Access anywhere, anytime" },
              { icon: Clock, title: "Real-Time", desc: "Live data & analytics" },
              { icon: HeadphonesIcon, title: "24/7 Support", desc: "Always here to help" },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all"
              >
                <item.icon className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-white/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 -z-10">
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors ${isDark ? 'bg-[#0066FF]/10' : 'bg-[#003D9B]/5'}`} />
          <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] transition-colors ${isDark ? 'bg-[#8B5CF6]/10' : 'bg-[#515f74]/5'}`} />
        </div>

        {/* Login Card */}
        <div className="w-full ">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <div className={`w-16 h-16 bg-gradient-to-br from-[#003D9B] to-[#0052CC] dark:from-[#0066FF] dark:to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-xl`}>
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#15803d] rounded-full border-2 border-white dark:border-[#111111] flex items-center justify-center">
                <Zap className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#003D9B] dark:text-[#0066FF]">PTLPOS</h1>
            <p className="text-[#434654] dark:text-[#888888] text-sm">Enterprise Retail Management</p>
          </div>

          {/* Login Form */}
          <div className={`rounded-3xl shadow-2xl p-6 md:p-8 transition-all ${isDark ? 'bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08]' : 'bg-white/80 backdrop-blur-2xl border border-white/60'}`}>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#0066FF]" />
                <span className="text-xs font-medium text-[#0066FF] uppercase tracking-wider">Welcome back</span>
              </div>
              <h2 className="text-2xl font-bold text-[#191C1E] dark:text-[#F1F1EE]">
                Sign in to your <span className="text-gradient-brand">account</span>
              </h2>
              <p className="text-[#737685] dark:text-[#888888] text-sm mt-1">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-[#ba1a1a] bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/30 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full" />
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685] dark:text-[#888888] group-focus-within:text-[#003D9B] dark:group-focus-within:text-[#0066FF]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full h-12 pl-12 pr-4 rounded-lg border transition-all outline-none text-[#191C1E] dark:text-[#F1F1EE] placeholder:text-[#737685]/50 dark:placeholder:text-[#888888]/50 ${isDark ? 'bg-[#1A1A1A] border-white/[0.08] focus:border-[#0066FF]' : 'bg-white border-[#E5E7EB] focus:border-[#003D9B]'}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Password</label>
                  <Link href="/forgot-password" className="text-sm text-[#003D9B] dark:text-[#0066FF] hover:underline">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685] dark:text-[#888888] group-focus-within:text-[#003D9B] dark:group-focus-within:text-[#0066FF]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full h-12 pl-12 pr-12 rounded-lg border transition-all outline-none text-[#191C1E] dark:text-[#F1F1EE] placeholder:text-[#737685]/50 dark:placeholder:text-[#888888]/50 ${isDark ? 'bg-[#1A1A1A] border-white/[0.08] focus:border-[#0066FF]' : 'bg-white border-[#E5E7EB] focus:border-[#003D9B]'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737685] dark:text-[#888888] hover:text-[#191C1E] dark:hover:text-[#F1F1EE]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Advanced Section */}
              {showAdvanced && (
                <div className="space-y-2 p-4 rounded-xl border border-[#003D9B]/20 bg-[#003D9B]/5">
                  <label htmlFor="tenantId" className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Organization ID</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003D9B] dark:text-[#0066FF]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <input
                      id="tenantId"
                      type="text"
                      placeholder="e.g., ACME-CORP"
                      value={tenantId}
                      onChange={(e) => setTenantId(e.target.value)}
                      className={`w-full h-11 pl-12 pr-4 rounded-lg border bg-white dark:bg-[#1A1A1A] border-[#003D9B]/30 dark:border-white/[0.08] font-mono uppercase text-[#191C1E] dark:text-[#F1F1EE]`}
                    />
                  </div>
                </div>
              )}

              {/* Remember */}
              <div className="flex items-center justify-between">
                <label htmlFor="remember" className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" id="remember" className="sr-only" />
                  <div className={`w-5 h-5 rounded-md border-2 ${isDark ? 'border-white/[0.15]' : 'border-[#E5E7EB]'} flex items-center justify-center`}>
                    <Check className="w-3 h-3 text-white opacity-0" />
                  </div>
                  <span className="text-sm text-[#737685] dark:text-[#888888]">Remember for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${
                  isDark 
                    ? 'bg-[#0066FF] text-white hover:bg-[#0052CC] shadow-[0_0_20px_rgba(0,102,255,0.3)]' 
                    : 'bg-gradient-to-r from-[#003D9B] to-[#0052CC] text-white hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing in...</span></>
                ) : (
                  <><span>Sign In</span><ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDark ? 'border-white/[0.08]' : 'border-[#E5E7EB]/50'}`} />
              </div>
              <div className="relative flex justify-center">
                <span className={`px-4 text-xs ${isDark ? 'bg-[#111111] text-[#888888]' : 'bg-white text-[#737685]/60'}`}>or continue with</span>
              </div>
            </div>

            {/* SSO Options */}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className={`flex items-center justify-center gap-3 h-11 rounded-lg border ${isDark ? 'border-white/[0.08] bg-[#1A1A1A] hover:bg-[#222222]' : 'border-[#E5E7EB] bg-white hover:bg-[#F7F9FB]'}`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 21.13 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.34-1.36-.34-2.09s.12-1.43.34-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 2.97 2.18 5.03l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Google</span>
              </button>
              <button type="button" className={`flex items-center justify-center gap-3 h-11 rounded-lg border ${isDark ? 'border-white/[0.08] bg-[#1A1A1A] hover:bg-[#222222]' : 'border-[#E5E7EB] bg-white hover:bg-[#F7F9FB]'}`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24z"/><path fill="#FFB900" d="M11.4 0v12.6H24V0H11.4z"/><path fill="#FF0021" d="M11.4 0L0 12.6V24L11.4 0z"/><path fill="#F2CD00" d="M23.3 0L24 0.1v12.5H11.4V0h11.9z"/></svg>
                <span className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Microsoft</span>
              </button>
            </div>

{/* Role Selector */}
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE] ml-1">Demo Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("ADMIN")}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                      selectedRole === "ADMIN"
                        ? isDark 
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                          : 'bg-blue-500/10 border-blue-600 text-blue-700'
                        : isDark 
                          ? 'bg-[#1A1A1A] border-white/20 text-[#F1F1EE] hover:bg-[#222222] hover:border-white/30' 
                          : 'bg-white border-gray-200 hover:border-blue-300 text-gray-900 hover:bg-blue-50'
                    }`}
                  >
                    <UserCog className="w-5 h-5" />
                    <span className="text-xs font-semibold">Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("MANAGER")}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                      selectedRole === "MANAGER"
                        ? isDark 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                          : 'bg-emerald-500/10 border-emerald-600 text-emerald-700'
                        : isDark 
                          ? 'bg-[#1A1A1A] border-white/20 text-[#F1F1EE] hover:bg-[#222222] hover:border-white/30' 
                          : 'bg-white border-gray-200 hover:border-emerald-300 text-gray-900 hover:bg-emerald-50'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span className="text-xs font-semibold">Manager</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("SALES_REP")}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                      selectedRole === "SALES_REP"
                        ? isDark 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                          : 'bg-amber-500/10 border-amber-600 text-amber-700'
                        : isDark 
                          ? 'bg-[#1A1A1A] border-white/20 text-[#F1F1EE] hover:bg-[#222222] hover:border-white/30' 
                          : 'bg-white border-gray-200 hover:border-amber-300 text-gray-900 hover:bg-amber-50'
                    }`}
                  >
                    <ShoppingBasket className="w-5 h-5" />
                    <span className="text-xs font-semibold">Sales</span>
                  </button>
                </div>
                <p className="text-xs text-center text-[#737685] dark:text-[#888888] mt-2">Select a demo role to explore different dashboards</p>
              </div>

            {/* Advanced Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm ${isDark ? 'text-[#888888] hover:text-[#F1F1EE]' : 'text-[#737685] hover:text-[#003D9B]'}`}
            >
              <Shield className="w-4 h-4" />
              <span>{showAdvanced ? "Hide" : "Show"} advanced options</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#737685] dark:text-[#888888]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#003D9B] dark:text-[#0066FF] font-semibold hover:underline">Start free trial</Link>
            </p>
            <div className="mt-4 flex justify-center gap-6 text-xs text-[#737685]/60 dark:text-[#888888]/40">
              <Link href="#" className="hover:text-[#191C1E] dark:hover:text-[#F1F1EE]">Privacy Policy</Link>
              <Link href="#" className="hover:text-[#191C1E] dark:hover:text-[#F1F1EE]">Terms of Service</Link>
              <Link href="#" className="hover:text-[#191C1E] dark:hover:text-[#F1F1EE]">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
