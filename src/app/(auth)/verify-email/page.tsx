"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle, MailOpen, AlertCircle } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import Link from "next/link";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { theme } = useTheme();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. Please check your email for the correct link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const { authApi } = await import("@/lib/api/auth");
        await authApi.verifyEmail(token);
        setStatus("success");
        setMessage("Email verified successfully!");
      } catch (err: unknown) {
        setStatus("error");
        let errorMessage = "Verification failed. The link may have expired.";
        if (typeof err === "object" && err !== null && "response" in err) {
          const axiosErr = err as { response?: { data?: { message?: string } } };
          errorMessage = axiosErr.response?.data?.message || errorMessage;
        }
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token]);

  const isDark = theme === "dark";

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB] dark:bg-[#0A0A0A]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#003D9B] dark:text-[#0066FF] mx-auto mb-4" />
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{message}</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden">
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]' : 'bg-gradient-to-br from-[#003D9B] via-[#0052CC] to-[#003D9B]'}`}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>
          <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Email<br />
              <span className="text-gradient-accent">Verified!</span>
            </h1>
            <p className="text-xl text-white/80">
              Your account is now verified. You can sign in to PTLPOS.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md text-center">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Verification Complete!
            </h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {message}
            </p>
            <Link
              href="/login"
              className={`inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl font-semibold transition-all ${
                isDark
                  ? 'bg-[#0066FF] text-white hover:bg-[#0052CC]'
                  : 'bg-[#003D9B] text-white hover:bg-[#003D9B]/90'
              }`}
            >
              Sign In to PTLPOS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]' : 'bg-gradient-to-br from-[#ba1a1a] via-[#991b1b] to-[#7f1d1d]'}`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Verification<br />
            <span className="text-red-400">Failed</span>
          </h1>
          <p className="text-xl text-white/80">
            Something went wrong with the verification.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Verification Failed
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {message}
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href="/login"
              className={`block w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                isDark
                  ? 'bg-[#0066FF] text-white hover:bg-[#0052CC]'
                  : 'bg-[#003D9B] text-white hover:bg-[#003D9B]/90'
              }`}
            >
              Go to Login
            </Link>
            <Link
              href="/register"
              className={`block w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                isDark
                  ? 'bg-[#1A1A1A] text-white hover:bg-[#222222] border border-white/[0.08]'
                  : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Register Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  const { theme } = useTheme();
  
return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB] dark:bg-[#0A0A0A]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}