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
  Loader2,
  Users,
  Package,
  UserCheck,
  DollarSign,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { analyticsApi } from "@/lib/api/analytics";
import { inventoryApi } from "@/lib/api/inventory";
import { shiftsApi } from "@/lib/api/shifts";
import type { DashboardAnalytics, Shift } from "@/types/api";
import { cn } from "@/lib/utils";

interface DashboardStats {
  customers: number;
  products: number;
  sales: { total: number; today: number };
  revenue: { total: number; today: number };
  activeShifts: number;
  lowStockAlerts: number;
}

export default function ManagerDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [activeShifts, setActiveShifts] = useState<Shift[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, analyticsData, shiftsData, lowStockData] = await Promise.all([
        analyticsApi.getDashboardStats().catch(() => null),
        analyticsApi.getDashboard().catch(() => null),
        shiftsApi.getActive().catch(() => []),
        inventoryApi.getLowStock(10).catch(() => []),
      ]);
      setStats(statsData);
      setAnalytics(analyticsData);
      setActiveShifts(shiftsData || []);
      setLowStockCount(lowStockData?.length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Customers", value: stats?.customers || 0, icon: Users, link: "/manager/customers" },
    { title: "Products", value: stats?.products || 0, icon: Package, link: "/manager/inventory" },
    { title: "Active Shifts", value: stats?.activeShifts || activeShifts.length, icon: UserCheck, link: "/manager/shifts" },
    { title: "Low Stock", value: stats?.lowStockAlerts || lowStockCount, icon: AlertTriangle, link: "/manager/inventory" },
  ];

  const quickActions = [
    { label: "New Sale", icon: ShoppingCart, href: "/pos-terminal" },
    { label: "Inventory", icon: Warehouse, href: "/manager/inventory" },
    { label: "Orders", icon: ClipboardList, href: "/manager/orders" },
    { label: "Customers", icon: Users, href: "/manager/customers" },
    { label: "Purchases", icon: PackagePlus, href: "/manager/purchases" },
  ];

  const topProducts = analytics?.topProducts?.slice(0, 5) || [];
  const recentSales = analytics?.recentSales?.slice(0, 5) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "PENDING": case "HELD": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "ACTIVE": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's your overview.</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          <TrendingUp className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(Number(stats?.revenue?.today) || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Total: ${(Number(stats?.revenue?.total) || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.sales?.today || 0}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Total: {stats?.sales?.total || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Staff</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeShifts.length}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Shifts active</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Items to Reorder</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {lowStockCount}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Below threshold</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all flex items-center gap-3"
              >
                <action.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white text-sm">{action.label}</span>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Products</h2>
                <Link href="/manager/sales" className="text-sm text-[#003D9B] dark:text-[#0066FF] hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-2">
                {topProducts.length > 0 ? topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#003D9B]/10 dark:bg-[#0066FF]/10 text-[#003D9B] dark:text-[#0066FF] text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{product.productName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 dark:text-white">${Number(product.revenue || 0).toLocaleString()}</span>
                      <p className="text-xs text-gray-500">{product.quantitySold} sold</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No sales data yet</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Sales</h2>
                <Link href="/manager/sales" className="text-sm text-[#003D9B] dark:text-[#0066FF] hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-2">
                {recentSales.length > 0 ? recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {(sale.customer?.name || sale.customerName || "Walk-in Customer")}
                      </p>
                      <p className="text-xs text-gray-500">{sale.saleNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${(Number(sale.totalAmount) || Number(sale.total) || 0).toLocaleString()}
                      </p>
                      <Badge className={cn("text-xs", getStatusBadge(sale.status))}>
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent sales</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <Link
                key={index}
                href={stat.link}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}