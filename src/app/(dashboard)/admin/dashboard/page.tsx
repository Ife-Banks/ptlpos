"use client";

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
} from "lucide-react";
import Link from "next/link";

const statsCards = [
  {
    title: "Total Users",
    value: "2,456",
    change: "+12.5%",
    icon: Users,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    title: "Products",
    value: "1,234",
    change: "+8.2%",
    icon: Package,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    title: "Total Orders",
    value: "8,921",
    change: "+23.1%",
    icon: ShoppingCart,
    color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    title: "Revenue",
    value: "$45,678",
    change: "+15.3%",
    icon: DollarSign,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
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
  { user: "Mike Johnson", action: "Processed refund", time: "1 hour ago", avatar: "MJ", color: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300" },
  { user: "Sarah Wilson", action: "Added new product", time: "2 hours ago", avatar: "SW", color: "bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300" },
];

const topProducts = [
  { name: "Premium Widget A", sku: "WGT-001", sales: 234, revenue: "$12,340" },
  { name: "Smart Gadget X", sku: "GDG-012", sales: 189, revenue: "$9,890" },
  { name: "Component Y", sku: "CMP-034", sales: 156, revenue: "$8,234" },
  { name: "Part Z", sku: "PRT-056", sales: 134, revenue: "$7,123" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <FileText className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div 
            key={stat.title}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stat.change}</span>
              <span className="text-gray-400 dark:text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button 
              variant="outline" 
              className={`border-gray-200 dark:border-gray-700 ${action.bg} transition-all duration-200`}
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="p-5 space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center text-sm font-semibold`}>
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{activity.user}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{activity.action}</p>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500 shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Products</h2>
          </div>
          <div className="p-5 space-y-3">
            {topProducts.map((product, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 font-mono">{product.sku}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-gray-900 dark:text-white">{product.revenue}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{product.sales} sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}