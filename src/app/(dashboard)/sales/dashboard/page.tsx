"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign, Package, Clock, CheckCircle, TrendingUp, Receipt, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";

const statsCards = [
  {
    title: "Today's Sales",
    value: "$1,234",
    change: "+8%",
    icon: ShoppingCart,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    title: "Orders",
    value: "12",
    change: "Today",
    icon: Receipt,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    title: "Pending",
    value: "3",
    change: "Awaiting payment",
    icon: Clock,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    title: "Completed",
    value: "9",
    change: "Today",
    icon: CheckCircle,
    color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  },
];

const recentSales = [
  { id: "SAL-2024-1234", customer: "John Doe", items: 3, total: 234.5, status: "Completed", time: "10 min ago" },
  { id: "SAL-2024-1233", customer: "Jane Smith", items: 2, total: 156.0, status: "Pending", time: "25 min ago" },
  { id: "SAL-2024-1232", customer: "Mike Johnson", items: 1, total: 89.99, status: "Completed", time: "1 hour ago" },
  { id: "SAL-2024-1231", customer: "Walk-in", items: 4, total: 312.0, status: "Completed", time: "2 hours ago" },
];

export default function SalesDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuthStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
      case "Pending":
        return { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
      default:
        return { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
    }
  };

  const getUserInitial = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name || "Sales Rep"}!</p>
        </div>
        <Link href="/pos-terminal">
          <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
            <ShoppingCart className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div 
            key={stat.title}
            className={cn(
              "rounded-xl border p-4 transition-all duration-200",
              isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <div className="flex items-center gap-1">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">({stat.change})</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cn(
          "rounded-xl border",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className={cn("p-5 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Sales</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest transactions</p>
          </div>
          <div className="p-5 space-y-3">
            {recentSales.map((sale) => {
              const status = getStatusBadge(sale.status);
              return (
                <div 
                  key={sale.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                    isDark ? "border-gray-800" : "border-gray-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                      isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
                    )}>
                      {getUserInitial(sale.customer)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{sale.id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{sale.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">${sale.total.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", status.color)}>{sale.status}</Badge>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{sale.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-5 pt-0">
            <Link href="/sales/sales">
              <Button variant="outline" className="w-full">
                View All Sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className={cn(
          "rounded-xl border",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className={cn("p-5 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Common tasks</p>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            <Link href="/pos-terminal">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-xs">New Sale</span>
              </Button>
            </Link>
            <Link href="/sales/sales">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-1">
                <Receipt className="h-5 w-5" />
                <span className="text-xs">View Sales</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}