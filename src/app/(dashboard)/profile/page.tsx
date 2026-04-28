"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/providers/theme-provider";
import { useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";
import { User, Mail, Phone, Lock, Save, Camera, Building2, MapPin, Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  tenant?: { name: string };
  branches?: Array<{ id: string; name: string }>;
}

export default function ProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user: storedUser } = useAuthStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);
        setName(String(data?.name || "") || "");
        setEmail(String(data?.email || "") || "");
        setPhone(String(data?.phone || "") || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile");
        if (storedUser) {
          setName(String(storedUser.name) || "");
          setEmail(String(storedUser.email) || "");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [storedUser]);

  const getUserInitial = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return { label: "Administrator", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
      case "MANAGER":
        return { label: "Manager", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
      case "SALES_REP":
        return { label: "Sales Rep", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" };
      case "SUPER_ADMIN":
        return { label: "Super Admin", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
      case "SUPPORT_ADMIN":
        return { label: "Support Admin", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" };
      case "BILLING_ADMIN":
        return { label: "Billing Admin", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
      default:
        return { label: role || "User", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
    }
  };

  const roleBadge = getRoleBadge(String(profile?.role || storedUser?.role));

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    if (newPassword === currentPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setPasswordError(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings</p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={cn(
          "rounded-xl border",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="p-6 text-center">
            <div className="relative inline-block">
              <div className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold",
                isDark ? "bg-[#0066FF]/20 text-[#0066FF]" : "bg-[#003D9B]/10 text-[#003D9B]"
              )}>
                {getUserInitial(String(profile?.name || storedUser?.name))}
              </div>
              <button className={cn(
                "absolute bottom-0 right-0 p-2 rounded-full",
                isDark ? "bg-gray-700 bg-gray-600" : "bg-white border border-gray-200"
              )}>
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{String(profile?.name || storedUser?.name)}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{String(profile?.email || storedUser?.email)}</p>
            <span className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold mt-2", roleBadge.color)}>
              {roleBadge.label}
            </span>
          </div>
        </div>

        {/* Organization Section */}
        {profile?.tenant && typeof profile.tenant === 'object' && 'name' in profile.tenant && (
          <div className={cn(
            "rounded-xl border",
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          )}>
            <div className={cn("p-6 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Organization</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your organization details</p>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Organization</p>
                  <p className="font-medium text-gray-900 dark:text-white">{String(profile.tenant.name)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Branch Assignments */}
        {profile?.branches && Array.isArray(profile.branches) && profile.branches.length > 0 && (
          <div className={cn(
            "rounded-xl border",
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          )}>
            <div className={cn("p-6 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Branch Assignments</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your assigned branches</p>
            </div>
            <div className="p-6 space-y-3">
              {profile.branches.map((branch) => (
                <div key={String(branch.id)} className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{String(branch.name)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={cn(
          "col-span-2 rounded-xl border",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className={cn("p-6 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal details</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn("pl-9", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn("pl-9", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={cn("pl-9", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "rounded-xl border",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      )}>
        <div className={cn("p-6 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your password</p>
        </div>
        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
          {(passwordError || passwordSuccess) && (
            <div className={cn(
              "p-3 text-sm rounded-lg",
              passwordSuccess 
                ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" 
                : "text-red-600 bg-red-50 dark:bg-red-900/20"
            )}>
              {passwordSuccess || passwordError}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={cn("pl-9", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
                />
              </div>
            </div>
            <div></div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={cn("pl-9", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn("pl-9", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90"
              disabled={isChangingPassword}
            >
              <Save className="mr-2 h-4 w-4" />
              {isChangingPassword ? "Changing..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}