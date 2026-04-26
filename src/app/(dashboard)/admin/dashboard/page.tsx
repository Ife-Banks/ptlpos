"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Activity,
  Loader2,
  Warehouse,
  Building2,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { analyticsApi } from "@/lib/api/analytics";
import { productsApi } from "@/lib/api/products";
import { customersApi } from "@/lib/api/customers";
import { categoriesApi } from "@/lib/api/categories";
import { branchesApi } from "@/lib/api/branches";

export default function AdminDashboardPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    revenue: 0,
    revenueChange: 0,
    salesCount: 0,
    salesCountChange: 0,
    products: 0,
    customers: 0,
    categories: 0,
    branches: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analytics, products, customers, categories, branches] = await Promise.all([
        analyticsApi.getDashboard(),
        productsApi.list({ limit: 1 }),
        customersApi.list({ limit: 1 }),
        categoriesApi.list({ limit: 1 }),
        branchesApi.list({ limit: 1 }),
      ]);

      setCounts({
        revenue: analytics.revenue || 0,
        revenueChange: analytics.revenueChange || 0,
        salesCount: analytics.salesCount || 0,
        salesCountChange: analytics.salesCountChange || 0,
        products: products.total || 0,
        customers: customers.total || 0,
        categories: categories.total || 0,
        branches: branches.total || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Revenue",
      value: counts.revenue ? `$${counts.revenue.toLocaleString()}` : "$0",
      change: `${counts.revenueChange}%`,
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      link: "/admin/analytics",
    },
    {
      title: "Total Sales",
      value: counts.salesCount.toString(),
      change: `${counts.salesCountChange}%`,
      icon: ShoppingCart,
      color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
      link: "/admin/sales",
    },
    {
      title: "Products",
      value: counts.products.toString(),
      change: "All time",
      icon: Package,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      link: "/manager/inventory",
    },
    {
      title: "Customers",
      value: counts.customers.toString(),
      change: "All time",
      icon: Users,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      link: "/manager/customers",
    },
  ];

  const quickActions = [
    { label: "Users", icon: Users, href: "/admin/users", color: "text-blue-500" },
    { label: "Products", icon: Package, href: "/manager/inventory", color: "text-emerald-500" },
    { label: "Categories", icon: ClipboardList, href: "/manager/inventory", color: "text-violet-500" },
    { label: "Branches", icon: Building2, href: "/manager/inventory", color: "text-amber-500" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics", color: "text-blue-500" },
  ];

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Button 
          onClick={loadDashboardData}
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
        >
          <Activity className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      )}

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
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.change}</p>
            </Link>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-lg transition-all cursor-pointer"
            >
              <action.icon className={`h-6 w-6 ${action.color} mb-2`} />
              <p className="font-medium text-gray-900 dark:text-white text-sm">{action.label}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}