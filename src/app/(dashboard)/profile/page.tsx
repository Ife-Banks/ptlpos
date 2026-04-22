"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/providers/theme-provider";
import { useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";
import { User, Mail, Phone, Lock, Save, Camera } from "lucide-react";

export default function ProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuthStore();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("+1 234 567 8900");

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
      default:
        return { label: role || "User", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
    }
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <div className="space-y-6 p-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings</p>
      </div>

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
                {getUserInitial(user?.name)}
              </div>
              <button className={cn(
                "absolute bottom-0 right-0 p-2 rounded-full",
                isDark ? "bg-gray-700 bg-gray-600" : "bg-white border border-gray-200"
              )}>
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <Badge className={cn("mt-2", roleBadge.color)}>{roleBadge.label}</Badge>
          </div>
        </div>

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
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter current password"
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
                  className={cn("pl-9", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
              <Save className="mr-2 h-4 w-4" />
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}