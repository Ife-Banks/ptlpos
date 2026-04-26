"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Building2, CreditCard, Ticket, Loader2, AlertCircle, Calendar } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { adminApi } from "@/lib/api/admin";

export default function SuperAdminAnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [overview, setOverview] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const [overviewData, usageData, revenueData] = await Promise.all([
        adminApi.getOverview(),
        adminApi.getUsageAnalytics({ period: period }),
        adminApi.getRevenueAnalytics({ period: period }),
      ]);
      setOverview(overviewData);
      setUsage(usageData);
      setRevenue(revenueData);
    } catch (err) {
      setError("Failed to load analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const periods = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "1y", label: "1 Year" },
  ];

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">System-wide analytics and metrics.</p>
        </div>
        <div className="flex gap-2">
          {periods.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p.value)}
              className={period === p.value ? "bg-[#003D9B] dark:bg-[#0066FF] text-white" : ""}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-20 text-red-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      )}

      {/* Analytics Content */}
      {!loading && !error && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="h-8 w-8 text-blue-500" />
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview?.tenants?.total || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tenants</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-emerald-500" />
                <span className="text-xs text-gray-500">Active</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview?.tenants?.active || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Tenants</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="h-8 w-8 text-violet-500" />
                <span className="text-xs text-gray-500">Active</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview?.subscriptions?.active || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Subscriptions</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <Ticket className="h-8 w-8 text-amber-500" />
                <span className="text-xs text-gray-500">Open</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview?.support?.openTickets || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open Tickets</p>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue</h3>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              ${overview?.revenue?.toLocaleString() || "0.00"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total revenue for selected period</p>
          </div>

          {/* Usage Data Placeholder */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Usage Trends</h3>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <Calendar className="h-8 w-8 mr-2" />
              Usage analytics will be displayed here
            </div>
          </div>
        </div>
      )}
    </div>
  );
}