"use client";

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
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const statsCards = [
  {
    title: "Today's Revenue",
    value: "$4,567",
    change: "+12%",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    title: "Low Stock Items",
    value: "8",
    change: "Items need restocking",
    icon: AlertTriangle,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    title: "Open Orders",
    value: "23",
    change: "Orders today",
    icon: ShoppingCart,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    title: "Pending Purchases",
    value: "5",
    change: "Awaiting delivery",
    icon: PackagePlus,
    color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  },
];

const quickActions = [
  { label: "POS Sale", icon: ShoppingCart, href: "/pos-terminal", bg: "hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-900/20" },
  { label: "Inventory", icon: Warehouse, href: "/manager/inventory", bg: "hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20" },
  { label: "Orders", icon: ClipboardList, href: "/manager/orders", bg: "hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-violet-900/20" },
  { label: "Purchases", icon: PackagePlus, href: "/manager/purchases", bg: "hover:bg-amber-50 hover:border-amber-200 dark:hover:bg-amber-900/20" },
];

const lowStockItems = [
  { name: "Widget A", sku: "WGT-001", quantity: 5, threshold: 10 },
  { name: "Gadget X", sku: "GDG-012", quantity: 3, threshold: 15 },
  { name: "Component Y", sku: "CMP-034", quantity: 8, threshold: 20 },
  { name: "Part Z", sku: "PRT-056", quantity: 2, threshold: 10 },
];

const recentOrders = [
  { id: "ORD-1234", customer: "John Doe", amount: "$234.50", status: "Completed", time: "10 min ago", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { id: "ORD-1233", customer: "Jane Smith", amount: "$156.00", status: "Pending", time: "25 min ago", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { id: "ORD-1232", customer: "Mike Johnson", amount: "$89.99", status: "Completed", time: "1 hour ago", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { id: "ORD-1231", customer: "Sarah Wilson", amount: "$312.00", status: "Processing", time: "2 hours ago", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
];

export default function ManagerDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here&apos;s your store overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/pos-terminal">
            <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div 
            key={stat.title}
            className={cn(
              "rounded-xl border p-5 hover:shadow-lg transition-all duration-200",
              isDark ? "bg-gray-900 border-gray-800 hover:border-gray-700" : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</span>
              <div className={cn("p-2 rounded-lg", stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button 
              variant="outline" 
              className={cn(
                "border-gray-200 dark:border-gray-700 transition-all duration-200",
                action.bg
              )}
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cn(
          "rounded-xl border",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className={cn("p-5 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alerts</h2>
              <Badge variant="destructive">{lowStockItems.length}</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Items below threshold</p>
          </div>
          <div className="p-5 space-y-3">
            {lowStockItems.map((item) => (
              <div 
                key={item.sku}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  isDark ? "bg-amber-900/20 border-amber-800/30" : "bg-amber-50 border-amber-200"
                )}
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600 dark:text-amber-400">{item.quantity}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">min: {item.threshold}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 pt-0">
            <Link href="/manager/inventory">
              <Button variant="outline" className="w-full">
                View Inventory
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest transactions</p>
          </div>
          <div className="p-5 space-y-3">
            {recentOrders.map((order) => (
              <div 
                key={order.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                  isDark ? "border-gray-800" : "border-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold", order.color)}>
                    {order.customer.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{order.amount}</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={order.status === "Completed" ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        order.status === "Completed" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                        order.status === "Pending" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                        order.status === "Processing" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      )}
                    >
                      {order.status}
                    </Badge>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{order.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}