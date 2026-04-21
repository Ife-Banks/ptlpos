"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
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
      <div className="bg-surface-container-lowest border border-border-light rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-success-bg rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-2">Check your email</h1>
          <p className="text-sm text-text-muted mb-6">
            We've sent password reset instructions to <span className="font-medium text-text-primary">{email}</span>
          </p>
          <Link 
            href="/login" 
            className="text-primary hover:underline text-sm"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-border-light rounded-xl shadow-lg p-8">
      {/* Branding */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-text-primary">Forgot password</h1>
        <p className="text-sm text-text-muted">
          Enter your email and we'll send you reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-error bg-error-bg rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>

        <p className="text-sm text-center text-text-muted">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-border-light flex justify-center gap-4 text-xs text-text-muted">
        <Link href="#" className="hover:text-primary">Privacy Policy</Link>
        <Link href="#" className="hover:text-primary">Terms of Service</Link>
      </div>
    </div>
  );
}