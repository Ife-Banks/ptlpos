"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ShoppingCart, ArrowRight, Zap, Shield, Mail, Lock, Check, Building2, Globe, Clock, HeadphonesIcon, User, CheckCircle, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useTheme } from "@/components/providers/theme-provider";

export default function RegisterPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    logout();
    setMounted(true);
  }, [logout]);

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

    try {
      const { authApi } = await import("@/lib/api/auth");
      await authApi.register({
        tenant: {
          name: orgName,
          email: orgEmail,
        },
        user: {
          name: userName,
          email: userEmail,
          password: password,
        },
      });
      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      setIsLoading(false);
      let message = "Registration failed. Please try again.";
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

  if (success) {
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
              Welcome to<br />
              <span className="text-gradient-accent">PTLPOS</span>
            </h1>
            <p className="text-2xl text-white/80 mb-6 max-w-full">
              Your enterprise retail management solution is ready.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md text-center">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Account Created!
            </h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Redirecting to login...
            </p>
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
            Start your<br />
            <span className="text-gradient-accent">business</span>
          </h1>
          <p className="text-2xl text-white/80 mb-6 max-w-full">
            Create your organization and manage your retail operations from day one.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Building2, title: "Multi-Branch", desc: "Manage unlimited locations" },
              { icon: Globe, title: "Cloud-Based", desc: "Access anywhere, anytime" },
              { icon: Clock, title: "Real-Time", desc: "Live data & analytics" },
              { icon: HeadphonesIcon, title: "24/7 Support", desc: "Always here to help" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all">
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

        <div className="w-full">
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
                <Zap className="w-4 h-4 text-[#0066FF]" />
                <span className="text-xs font-medium text-[#0066FF] uppercase tracking-wider">Get Started</span>
              </div>
              <h2 className="text-2xl font-bold text-[#191C1E] dark:text-[#F1F1EE]">
                Create your <span className="text-gradient-brand">account</span>
              </h2>
              <p className="text-[#737685] dark:text-[#888888] text-sm mt-1">
                {step === 1 ? "Enter your organization details" : "Create your admin account"}
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              <div className={`h-2 w-16 rounded-full transition-all ${step >= 1 ? 'bg-[#003D9B] dark:bg-[#0066FF]' : isDark ? 'bg-[#222222]' : 'bg-gray-200'}`} />
              <div className={`h-2 w-16 rounded-full transition-all ${step >= 2 ? 'bg-[#003D9B] dark:bg-[#0066FF]' : isDark ? 'bg-[#222222]' : 'bg-gray-200'}`} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-[#ba1a1a] bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/30 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full" />
                  {error}
                </div>
              )}

              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <label htmlFor="orgName" className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Organization Name *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685] dark:text-[#888888] group-focus-within:text-[#003D9B] dark:group-focus-within:text-[#0066FF]">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <input
                        id="orgName"
                        type="text"
                        placeholder="Your company name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        required
                        className={`w-full h-12 pl-12 pr-4 rounded-lg border transition-all outline-none text-[#191C1E] dark:text-[#F1F1EE] placeholder:text-[#737685]/50 dark:placeholder:text-[#888888]/50 ${isDark ? 'bg-[#1A1A1A] border-white/[0.08] focus:border-[#0066FF]' : 'bg-white border-[#E5E7EB] focus:border-[#003D9B]'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="orgEmail" className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Organization Email *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685] dark:text-[#888888] group-focus-within:text-[#003D9B] dark:group-focus-within:text-[#0066FF]">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        id="orgEmail"
                        type="email"
                        placeholder="contact@company.com"
                        value={orgEmail}
                        onChange={(e) => setOrgEmail(e.target.value)}
                        required
                        className={`w-full h-12 pl-12 pr-4 rounded-lg border transition-all outline-none text-[#191C1E] dark:text-[#F1F1EE] placeholder:text-[#737685]/50 dark:placeholder:text-[#888888]/50 ${isDark ? 'bg-[#1A1A1A] border-white/[0.08] focus:border-[#0066FF]' : 'bg-white border-[#E5E7EB] focus:border-[#003D9B]'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="orgPhone" className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Phone</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685] dark:text-[#888888] group-focus-within:text-[#003D9B] dark:group-focus-within:text-[#0066FF]">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        id="orgPhone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={orgPhone}
                        onChange={(e) => setOrgPhone(e.target.value)}
                        className={`w-full h-12 pl-12 pr-4 rounded-lg border transition-all outline-none text-[#191C1E] dark:text-[#F1F1EE] placeholder:text-[#737685]/50 dark:placeholder:text-[#888888]/50 ${isDark ? 'bg-[#1A1A1A] border-white/[0.08] focus:border-[#0066FF]' : 'bg-white border-[#E5E7EB] focus:border-[#003D9B]'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="orgWebsite" className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Website</label>
                    <input
                      id="orgWebsite"
                      type="url"
                      placeholder="https://company.com"
                      value={orgWebsite}
                      onChange={(e) => setOrgWebsite(e.target.value)}
                      className={`w-full h-12 px-4 rounded-lg border transition-all outline-none text-[#191C1E] dark:text-[#F1F1EE] placeholder:text-[#737685]/50 dark:placeholder:text-[#888888]/50 ${isDark ? 'bg-[#1A1A1A] border-white/[0.08] focus:border-[#0066FF]' : 'bg-white border-[#E5E7EB] focus:border-[#003D9B]'}`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="userName" className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Full Name *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685] dark:text-[#888888] group-focus-within:text-[#003D9B] dark:group-focus-within:text-[#0066FF]">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        id="userName"
                        type="text"
                        placeholder="John Doe"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className={`w-full h-12 pl-12 pr-4 rounded-lg border transition-all outline-none text-[#191C1E] dark:text-[#F1F1EE] placeholder:text-[#737685]/50 dark:placeholder:text-[#888888]/50 ${isDark ? 'bg-[#1A1A1A] border-white/[0.08] focus:border-[#0066FF]' : 'bg-white border-[#E5E7EB] focus:border-[#003D9B]'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="userEmail" className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Email *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685] dark:text-[#888888] group-focus-within:text-[#003D9B] dark:group-focus-within:text-[#0066FF]">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        id="userEmail"
                        type="email"
                        placeholder="john@company.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                        className={`w-full h-12 pl-12 pr-4 rounded-lg border transition-all outline-none text-[#191C1E] dark:text-[#F1F1EE] placeholder:text-[#737685]/50 dark:placeholder:text-[#888888]/50 ${isDark ? 'bg-[#1A1A1A] border-white/[0.08] focus:border-[#0066FF]' : 'bg-white border-[#E5E7EB] focus:border-[#003D9B]'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Password *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685] dark:text-[#888888] group-focus-within:text-[#003D9B] dark:group-focus-within:text-[#0066FF]">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className={`w-full h-12 pl-12 pr-12 rounded-lg border transition-all outline-none text-[#191C1E] dark:text-[#F1F1EE] placeholder:text-[#737685]/50 dark:placeholder:text-[#888888]/50 ${isDark ? 'bg-[#1A1A1A] border-white/[0.08] focus:border-[#0066FF]' : 'bg-white border-[#E5E7EB] focus:border-[#003D9B]'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737685] dark:text-[#888888] hover:text-[#191C1E] dark:hover:text-[#F1F1EE]"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-[#737685] dark:text-[#888888]">Must be at least 8 characters</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-[#191C1E] dark:text-[#F1F1EE]">Confirm Password *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685] dark:text-[#888888] group-focus-within:text-[#003D9B] dark:group-focus-within:text-[#0066FF]">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={`w-full h-12 pl-12 pr-4 rounded-lg border transition-all outline-none text-[#191C1E] dark:text-[#F1F1EE] placeholder:text-[#737685]/50 dark:placeholder:text-[#888888]/50 ${isDark ? 'bg-[#1A1A1A] border-white/[0.08] focus:border-[#0066FF]' : 'bg-white border-[#E5E7EB] focus:border-[#003D9B]'}`}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`flex-1 h-12 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                      isDark
                        ? 'bg-[#1A1A1A] text-[#F1F1EE] hover:bg-[#222222] border border-white/[0.08]'
                        : 'bg-white text-gray-900 hover:bg-gray-50 border border-[#E5E7EB]'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 h-12 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${
                    isDark
                      ? 'bg-[#0066FF] text-white hover:bg-[#0052CC] shadow-[0_0_20px_rgba(0,102,255,0.3)]'
                      : 'bg-gradient-to-r from-[#003D9B] to-[#0052CC] text-white hover:shadow-lg'
                  }`}
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating...</span></>
                  ) : step === 1 ? (
                    <><span>Continue</span><ArrowRight className="w-5 h-5" /></>
                  ) : (
                    <><span>Create Account</span><CheckCircle className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </form>

            <p className={`text-sm text-center pt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Already have an account?{" "}
              <Link href="/login" className="text-[#003D9B] dark:text-[#0066FF] hover:underline font-medium">
                Sign in
              </Link>
            </p>

            <div className={`mt-6 pt-6 border-t flex justify-center gap-6 text-xs ${isDark ? 'border-white/[0.08] text-[#888888]/40' : 'border-gray-200 text-gray-400'}`}>
              <Link href="#" className={isDark ? 'hover:text-[#F1F1EE]' : 'hover:text-gray-600'}>Privacy Policy</Link>
              <Link href="#" className={isDark ? 'hover:text-[#F1F1EE]' : 'hover:text-gray-600'}>Terms of Service</Link>
              <Link href="#" className={isDark ? 'hover:text-[#F1F1EE]' : 'hover:text-gray-600'}>Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}