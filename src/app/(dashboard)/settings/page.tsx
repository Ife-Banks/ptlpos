"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { Save, Store, Receipt, Bell, Monitor, Shield, Globe } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const [storeName, setStoreName] = useState("PTLPOS Store");
  const [storeEmail, setStoreEmail] = useState("store@ptlpos.com");
  const [storePhone, setStorePhone] = useState("+1 234 567 8900");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState("7.5");
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    DailyReport: true,
    weeklyReport: false,
  });

  return (
    <div className="space-y-6 p-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your store settings</p>
      </div>

      <div className={cn(
        "rounded-xl border",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      )}>
        <div className={cn("p-6 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Store Information</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Basic store details</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Store Name</label>
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
              <Input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <Input
                type="tel"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border",
                  isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                )}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="NGN">NGN - Nigerian Naira</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "rounded-xl border",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      )}>
        <div className={cn("p-6 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Settings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure sales and tax</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Default Tax Rate (%)</label>
              <Input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "rounded-xl border",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      )}>
        <div className={cn("p-6 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage notification preferences</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Low Stock Alerts</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when stock is low</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, lowStock: !notifications.lowStock })}
              className={cn(
                "w-12 h-6 rounded-full transition-colors",
                notifications.lowStock ? "bg-[#003D9B] dark:bg-[#0066FF]" : "bg-gray-300 dark:bg-gray-600"
              )}
            >
              <span className={cn(
                "block w-5 h-5 rounded-full bg-white shadow transition-transform",
                notifications.lowStock ? "translate-x-6" : "translate-x-0.5"
              )} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">New Orders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get notified for new orders</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, newOrders: !notifications.newOrders })}
              className={cn(
                "w-12 h-6 rounded-full transition-colors",
                notifications.newOrders ? "bg-[#003D9B] dark:bg-[#0066FF]" : "bg-gray-300 dark:bg-gray-600"
              )}
            >
              <span className={cn(
                "block w-5 h-5 rounded-full bg-white shadow transition-transform",
                notifications.newOrders ? "translate-x-6" : "translate-x-0.5"
              )} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Daily Report</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive daily sales report</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, DailyReport: !notifications.DailyReport })}
              className={cn(
                "w-12 h-6 rounded-full transition-colors",
                notifications.DailyReport ? "bg-[#003D9B] dark:bg-[#0066FF]" : "bg-gray-300 dark:bg-gray-600"
              )}
            >
              <span className={cn(
                "block w-5 h-5 rounded-full bg-white shadow transition-transform",
                notifications.DailyReport ? "translate-x-6" : "translate-x-0.5"
              )} />
            </button>
          </div>
        </div>
      </div>

      <div className={cn(
        "rounded-xl border",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      )}>
        <div className={cn("p-6 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <Monitor className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize the look and feel</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
            </div>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn(
                "w-12 h-6 rounded-full transition-colors",
                isDark ? "bg-[#003D9B] dark:bg-[#0066FF]" : "bg-gray-300 dark:bg-gray-600"
              )}
            >
              <span className={cn(
                "block w-5 h-5 rounded-full bg-white shadow transition-transform",
                isDark ? "translate-x-6" : "translate-x-0.5"
              )} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}