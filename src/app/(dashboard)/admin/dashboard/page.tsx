"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Activity,
  RefreshCw,
  Building2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { analyticsApi } from "@/lib/api/analytics";
import { productsApi } from "@/lib/api/products";
import { customersApi } from "@/lib/api/customers";
import { categoriesApi } from "@/lib/api/categories";
import { branchesApi } from "@/lib/api/branches";
import { cn, formatCurrency } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  iconColor: string;
  loading?: boolean;
  href?: string;
}

function StatCard({ title, value, change, changeLabel, icon: Icon, iconColor, loading, href }: StatCardProps) {
  const content = (
    <Card className="hover:shadow-lg transition-all duration-200 hover:border-[#003D9B]/30 dark:hover:border-[#0066FF]/30">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-16" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {typeof value === "number" && title.toLowerCase().includes("revenue")
                    ? formatCurrency(value)
                    : typeof value === "number"
                    ? value.toLocaleString()
                    : value}
                </p>
                {change !== undefined && (
                  <div className="flex items-center gap-1">
                    {change >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={cn(
                      "text-xs font-medium",
                      change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    )}>
                      {Math.abs(change)}%
                    </span>
                    {changeLabel && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">vs last period</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export default function AdminDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const [analytics, setAnalytics] = useState<{
    revenue: number;
    revenueChange: number;
    salesCount: number;
    salesCountChange: number;
    customersCount: number;
    inventoryValue: number;
    topProducts: Array<{ productName: string; quantitySold: number; revenue: number }>;
  }>({
    revenue: 0,
    revenueChange: 0,
    salesCount: 0,
    salesCountChange: 0,
    customersCount: 0,
    inventoryValue: 0,
    topProducts: [],
  });

  const [counts, setCounts] = useState({
    products: 0,
    customers: 0,
    categories: 0,
    branches: 0,
  });

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const stats = await analyticsApi.getDashboardStats();

      setCounts({
        products: stats.products || 0,
        customers: stats.customers || 0,
        categories: 0,
        branches: 0,
      });

      setAnalytics({
        revenue: stats.revenue?.total || 0,
        revenueChange: 0,
        salesCount: stats.sales?.total || 0,
        salesCountChange: 0,
        customersCount: stats.customers || 0,
        inventoryValue: 0,
        topProducts: [],
      });
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const statsCards = [
    {
      title: "Total Revenue",
      value: analytics.revenue,
      change: analytics.revenueChange,
      changeLabel: "vs last period",
      icon: DollarSign,
      iconColor: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      href: "/admin/analytics",
    },
    {
      title: "Total Sales",
      value: analytics.salesCount,
      change: analytics.salesCountChange,
      changeLabel: "vs last period",
      icon: ShoppingCart,
      iconColor: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
      href: "/admin/sales",
    },
    {
      title: "Inventory Value",
      value: analytics.inventoryValue,
      change: undefined,
      icon: Warehouse,
      iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      href: "/manager/inventory",
    },
    {
      title: "Active Customers",
      value: analytics.customersCount || counts.customers,
      change: undefined,
      icon: Users,
      iconColor: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      href: "/manager/customers",
    },
  ];

  const quickLinks = [
    { label: "Products", desc: `${counts.products} items`, icon: Package, href: "/admin/products", color: "text-blue-600 dark:text-blue-400" },
    { label: "Categories", desc: `${counts.categories} categories`, icon: BarChart3, href: "/admin/categories", color: "text-violet-600 dark:text-violet-400" },
    { label: "Branches", desc: `${counts.branches} locations`, icon: Building2, href: "/admin/branches", color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Users", desc: "Manage staff", icon: Users, href: "/admin/users", color: "text-amber-600 dark:text-amber-400" },
  ];

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's an overview of your business.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              className={cn(
                "h-9 rounded-lg border px-3 text-sm",
                isDark 
                  ? "bg-gray-800 border-gray-700 text-white" 
                  : "bg-white border-gray-200 text-gray-700"
              )}
              onChange={(e) => {
                const days = parseInt(e.target.value);
                setDateRange({
                  from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  to: new Date().toISOString().split("T")[0],
                });
              }}
            >
              <option value="7">Last 7 days</option>
              <option value="30" selected>Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <Button
            onClick={loadDashboardData}
            disabled={loading}
            className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} loading={loading} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Selling Products
            </CardTitle>
            <Link 
              href="/admin/products" 
              className="text-sm text-[#003D9B] dark:text-[#0066FF] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : analytics.topProducts.length > 0 ? (
              <div className="space-y-3">
                {analytics.topProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold",
                      index === 0
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : index === 1
                        ? "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        : index === 2
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    )}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {product.productName || "Product"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.quantitySold} sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No sales data yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Start making sales to see top products</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  isDark 
                    ? "bg-gray-800/50 hover:bg-gray-800" 
                    : "bg-gray-50 hover:bg-gray-100"
                )}
              >
                <div className={cn("p-2 rounded-lg", isDark ? "bg-gray-700" : "bg-white")}>
                  <link.icon className={`h-5 w-5 ${link.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{link.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{link.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Management Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/analytics"
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:shadow-md",
            isDark 
              ? "bg-gray-900 border-gray-800 hover:border-gray-700" 
              : "bg-white border-gray-200 hover:border-gray-300"
          )}
        >
          <BarChart3 className="h-8 w-8 text-[#003D9B] dark:text-[#0066FF] mb-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Analytics</span>
        </Link>
        <Link
          href="/admin/import-export"
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:shadow-md",
            isDark 
              ? "bg-gray-900 border-gray-800 hover:border-gray-700" 
              : "bg-white border-gray-200 hover:border-gray-300"
          )}
        >
          <Activity className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Import/Export</span>
        </Link>
        <Link
          href="/admin/audit"
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:shadow-md",
            isDark 
              ? "bg-gray-900 border-gray-800 hover:border-gray-700" 
              : "bg-white border-gray-200 hover:border-gray-300"
          )}
        >
          <Activity className="h-8 w-8 text-violet-600 dark:text-violet-400 mb-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Audit Logs</span>
        </Link>
        <Link
          href="/admin/settings"
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:shadow-md",
            isDark 
              ? "bg-gray-900 border-gray-800 hover:border-gray-700" 
              : "bg-white border-gray-200 hover:border-gray-300"
          )}
        >
          <Activity className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Settings</span>
        </Link>
      </div>
    </div>
  );
}