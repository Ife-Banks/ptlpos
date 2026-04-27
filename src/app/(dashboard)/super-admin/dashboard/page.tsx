"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Users, CreditCard, Ticket, TrendingUp, Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { adminApi, type AdminAnalytics } from "@/lib/api/admin";

const ITEMS_PER_PAGE = 5;

export default function SuperAdminDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getOverview();
      setAnalytics(data);
    } catch (err) {
      setError("Failed to load analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Tenants",
      value: analytics?.tenants.total || 0,
      active: analytics?.tenants.active || 0,
      icon: Building2,
      color: "bg-blue-500",
      link: "/super-admin/tenants",
    },
    {
      title: "Active Subscriptions",
      value: analytics?.subscriptions.active || 0,
      total: analytics?.subscriptions.total || 0,
      icon: CreditCard,
      color: "bg-emerald-500",
      link: "/super-admin/subscriptions",
    },
    {
      title: "Open Tickets",
      value: analytics?.support.openTickets || 0,
      icon: Ticket,
      color: "bg-amber-500",
      link: "/super-admin/tickets",
    },
    {
      title: "Monthly Revenue",
      value: analytics?.revenue ? `$${analytics.revenue.toLocaleString()}` : "$0",
      icon: TrendingUp,
      color: "bg-violet-500",
      link: "/super-admin/analytics",
    },
  ];

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">System overview and management.</p>
        </div>
        <Button 
          onClick={loadAnalytics}
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
        >
          <Activity className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003D9B] dark:border-[#0066FF]"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center justify-center py-20 text-red-500">
          <AlertCircle className="mr-2 h-5 w-5" />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <a
              key={index}
              href={stat.link}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 ${stat.color.replace("bg-", "text-")} dark:text-white`} />
                </div>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
              {"active" in stat && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {stat.active} active
                </p>
              )}
              {"total" in stat && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {stat.total} total
                </p>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/super-admin/tenants"
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all cursor-pointer"
          >
            <Building2 className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Manage Tenants</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage all tenant organizations</p>
          </a>
          <a
            href="/super-admin/plans"
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all cursor-pointer"
          >
            <CreditCard className="h-8 w-8 text-emerald-500 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Subscription Plans</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create and manage pricing plans</p>
          </a>
          <a
            href="/super-admin/tickets"
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all cursor-pointer"
          >
            <Ticket className="h-8 w-8 text-amber-500 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Support Tickets</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage support requests</p>
          </a>
        </div>
      )}
    </div>
  );
}