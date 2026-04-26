"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  FileText,
  Settings,
  BarChart3,
  Activity,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { analyticsApi } from "@/lib/api/analytics";
import type { DashboardAnalytics } from "@/types/api";

export default function AdminDashboardPage() {
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await analyticsApi.getDashboard();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: analytics?.revenue ? "2,456" : "-",
      change: "+12.5%",
      icon: Users,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      link: "/admin/users",
    },
    {
      title: "Products",
      value: "1,234",
      change: "+8.2%",
      icon: Package,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      link: "/manager/inventory",
    },
    {
      title: "Total Orders",
      value: analytics?.salesCount?.toString() || "-",
      change: analytics?.salesCountChange ? `${analytics.salesCountChange}%` : "-",
      icon: ShoppingCart,
      color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
      link: "/admin/sales",
    },
    {
      title: "Revenue",
      value: analytics?.revenue ? `$${analytics.revenue.toLocaleString()}` : "-",
      change: analytics?.revenueChange ? `${analytics.revenueChange}%` : "-",
      icon: DollarSign,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      link: "/admin/analytics",
    },
  ];

  const quickActions = [
    { label: "Users", icon: Users, href: "/admin/users", bg: "hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics", bg: "hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-violet-900/20" },
    { label: "Reports", icon: FileText, href: "/admin/import-export", bg: "hover:bg-amber-50 hover:border-amber-200 dark:hover:bg-amber-900/20" },
    { label: "Settings", icon: Settings, href: "/admin/settings", bg: "hover:bg-gray-50 hover:border-gray-200 dark:hover:bg-gray-800/50" },
    { label: "Audit", icon: Activity, href: "/admin/audit", bg: "hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-900/20" },
  ];

  const recentActivity = [
    { user: "John Doe", action: "Created new order", time: "2 min ago", avatar: "JD", color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" },
    { user: "Jane Smith", action: "Updated inventory", time: "15 min ago", avatar: "JS", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300" },
  ];

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Button 
          onClick={loadAnalytics}
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
        >
          <Activity className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      )}

      {/* Stats Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <Link
              key={index}
              href={stat.link}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-lg transition-all cursor-pointer ${action.bg}`}
            >
              <action.icon className="h-6 w-6 text-gray-600 dark:text-gray-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white text-sm">{action.label}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      {!loading && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center text-sm font-semibold`}>
                  {activity.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{activity.user}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.action}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}