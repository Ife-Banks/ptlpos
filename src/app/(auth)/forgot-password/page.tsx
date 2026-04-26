"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, ShoppingCart, ArrowRight, Zap, Shield, Mail, CheckCircle } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useAuthStore } from "@/stores/auth-store";

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    logout();
    setMounted(true);
  }, [logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { authApi } = await import("@/lib/api/auth");
      await authApi.requestPasswordReset(email);
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (err: unknown) {
      setIsLoading(false);
      let message = "Failed to send reset email. Please try again.";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        message = axiosErr.response?.data?.message || message;
      }
      setError(message);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB] dark:bg-[#0A0A0A]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
      </div>
    );
  }

  const isDark = theme === "dark";

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden">
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]' : 'bg-gradient-to-br from-[#003D9B] via-[#0052CC] to-[#003D9B]'}`}>
            <div className="absolute inset-0">
              <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-40 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
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
              Reset your<br />
              <span className="text-gradient-accent">password</span>
            </h1>
            <p className="text-2xl text-white/80 mb-6 max-w-full">
              Follow the instructions in your email to regain access.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            <div className={`rounded-3xl shadow-2xl p-8 transition-all ${isDark ? 'bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08]' : 'bg-white/80 backdrop-blur-2xl border border-white/60'}`}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
                  <CheckCircle className={`w-8 h-8 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Check your email</h1>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  We've sent password reset instructions to{" "}
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{email}</span>
                </p>
                <Link
                  href="/login"
                  className={`text-sm hover:underline ${isDark ? 'text-[#0066FF]' : 'text-[#003D9B]'}`}
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]' : 'bg-gradient-to-br from-[#003D9B] via-[#0052CC] to-[#003D9B]'}`}>
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-40 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-2000" />
          </div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
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
            Forgot<br />
            <span className="text-gradient-accent">password</span>
          </h1>
          <p className="text-2xl text-white/80 mb-6 max-w-full">
            No worries, we'll help you get back in quickly.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, title: "Secure", desc: "Reset in seconds" },
              { icon: Zap, title: "Fast", desc: "Quick recovery" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors ${isDark ? 'bg-[#0066FF]/10' : 'bg-[#003D9B]/5'}`} />
          <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] transition-colors ${isDark ? 'bg-[#8B5CF6]/10' : 'bg-[#515f74]/5'}`} />
        </div>

        <div className="w-full max-w-md">
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
          </div>

          <div className={`rounded-3xl shadow-2xl p-6 md:p-8 transition-all ${isDark ? 'bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08]' : 'bg-white/80 backdrop-blur-2xl border border-white/60'}`}>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#0066FF]" />
                <span className="text-xs font-medium text-[#0066FF] uppercase tracking-wider">Reset Password</span>
              </div>
              <h2 className="text-2xl font-bold text-[#191C1E] dark:text-[#F1F1EE]">
                Forgot your <span className="text-gradient-brand">password</span>
              </h2>
              <p className="text-[#737685] dark:text-[#888888] text-sm mt-1">
                Enter your email and we'll send you reset instructions
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-[#ba1a1a] bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/30 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full" />
                  {error}
                </div>
              )}

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
                  <><Loader2 className="w-5 h-5 animate-spin" /><span>Sending...</span></>
                ) : (
                  <><span>Send reset link</span><ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <p className={`text-sm text-center pt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Remember your password?{" "}
              <Link href="/login" className="text-[#003D9B] dark:text-[#0066FF] hover:underline font-medium">
                Sign in
              </Link>
            </p>

            <div className={`mt-6 pt-6 border-t flex justify-center gap-6 text-xs ${isDark ? 'border-white/[0.08] text-[#888888]/40' : 'border-gray-200 text-gray-400'}`}>
              <Link href="#" className={isDark ? 'hover:text-[#F1F1EE]' : 'hover:text-gray-600'}>Privacy Policy</Link>
              <Link href="#" className={isDark ? 'hover:text-[#F1F1EE]' : 'hover:text-gray-600'}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}