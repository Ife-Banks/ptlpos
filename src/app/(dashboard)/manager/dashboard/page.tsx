"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  PackagePlus,
  ClipboardList,
  Warehouse,
  ArrowUpRight,
  Loader2,
  Users,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { analyticsApi } from "@/lib/api/analytics";
import type { DashboardAnalytics } from "@/types/api";

const statsCards = [
  {
    title: "Today's Revenue",
    value: "$4,567",
    change: "+12%",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    link: "/manager/sales",
  },
  {
    title: "Low Stock Items",
    value: "8",
    change: "Items need restocking",
    icon: AlertTriangle,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    link: "/manager/inventory",
  },
  {
    title: "Open Orders",
    value: "23",
    change: "Orders today",
    icon: ShoppingCart,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    link: "/manager/orders",
  },
];

export default function ManagerDashboardPage() {
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

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

  const quickActions = [
    { label: "New Sale", icon: ShoppingCart, href: "/pos-terminal", bg: "hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20" },
    { label: "Inventory", icon: Warehouse, href: "/manager/inventory", bg: "hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-900/20" },
    { label: "Orders", icon: ClipboardList, href: "/manager/orders", bg: "hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-violet-900/20" },
    { label: "Customers", icon: Users, href: "/manager/customers", bg: "hover:bg-amber-50 hover:border-amber-200 dark:hover:bg-amber-900/20" },
    { label: "Purchases", icon: PackagePlus, href: "/manager/purchases", bg: "hover:bg-gray-50 hover:border-gray-200 dark:hover:bg-gray-800/50" },
  ];

  const topProducts = analytics?.topProducts?.slice(0, 5) || [];
  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", total: "$245.00", status: "COMPLETED", items: 3 },
    { id: "ORD-002", customer: "Jane Smith", total: "$89.50", status: "PENDING", items: 2 },
    { id: "ORD-003", customer: "Mike Johnson", total: "$156.00", status: "PROCESSING", items: 4 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { label: "Completed", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
      case "PENDING":
        return { label: "Pending", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
      case "PROCESSING":
        return { label: "Processing", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
      default:
        return { label: status, className: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's your overview.</p>
        </div>
        <Button onClick={loadAnalytics} className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white">
          <TrendingUp className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      )}

      {!loading && (
        <>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h2>
              <div className="space-y-3">
                {topProducts.length > 0 ? topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{product.productName}</p>
                      <p className="text-sm text-gray-500">{product.quantitySold} sold</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">${product.revenue.toLocaleString()}</p>
                  </div>
                )) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No data available</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.id} • {order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">${order.total}</p>
                        <Badge className={badge.className}>{badge.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link href="/manager/orders" className="flex items-center justify-center gap-2 mt-4 text-sm text-[#003D9B] dark:text-[#0066FF] hover:underline">
                View all orders <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}