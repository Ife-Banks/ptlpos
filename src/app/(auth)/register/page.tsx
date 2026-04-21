"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShoppingCart, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
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

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/admin/dashboard";
    }, 1500);
  };

  return (
    <div className="bg-surface-container-lowest border border-border-light rounded-xl shadow-lg p-8">
      {/* Branding */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-text-primary">Create an account</h1>
        <p className="text-sm text-text-muted">
          {step === 1 ? "Enter your organization details" : "Create your admin account"}
        </p>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-2 mb-6">
        <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
        <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-error bg-error-bg rounded-md">
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                type="text"
                placeholder="Your company name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgEmail">Organization Email *</Label>
              <Input
                id="orgEmail"
                type="email"
                placeholder="contact@company.com"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgPhone">Phone</Label>
              <Input
                id="orgPhone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={orgPhone}
                onChange={(e) => setOrgPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgWebsite">Website</Label>
              <Input
                id="orgWebsite"
                type="url"
                placeholder="https://company.com"
                value={orgWebsite}
                onChange={(e) => setOrgWebsite(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name *</Label>
              <Input
                id="userName"
                type="text"
                placeholder="John Doe"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">Email *</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="john@company.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-text-muted">Must be at least 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="flex gap-2 pt-2">
          {step === 2 && (
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button 
            type="submit" 
            className="flex-1" 
            size="lg"
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

        <p className="text-sm text-center text-text-muted pt-2">
          Already have an account?{" "}
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