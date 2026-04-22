"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Download,
  BarChart3,
  Package as PackageIcon,
  Store,
  UserCheck,
} from "lucide-react";

const stats = [
  { title: "Total Revenue", value: "$276,800", change: "+15.3%", icon: DollarSign, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { title: "Total Orders", value: "5,562", change: "+23.1%", icon: ShoppingCart, color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
  { title: "Total Users", value: "2,456", change: "+12.5%", icon: Users, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { title: "Products Sold", value: "8,921", change: "+8.2%", icon: Package, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
];

const revenueData = [
  { month: "Jan", value: 12500 },
  { month: "Feb", value: 15200 },
  { month: "Mar", value: 18800 },
  { month: "Apr", value: 16400 },
  { month: "May", value: 21200 },
  { month: "Jun", value: 25600 },
  { month: "Jul", value: 23400 },
  { month: "Aug", value: 27800 },
  { month: "Sep", value: 31200 },
  { month: "Oct", value: 29400 },
  { month: "Nov", value: 35600 },
  { month: "Dec", value: 41200 },
];

const topCategories = [
  { name: "Electronics", sales: 1234, revenue: "$45,678", growth: "+15.3%", progress: 85 },
  { name: "Clothing", sales: 987, revenue: "$32,456", growth: "+12.1%", progress: 70 },
  { name: "Home & Garden", sales: 756, revenue: "$28,234", growth: "+8.7%", progress: 55 },
  { name: "Sports", sales: 654, revenue: "$23,456", growth: "+5.4%", progress: 45 },
  { name: "Books", sales: 543, revenue: "$18,765", growth: "+3.2%", progress: 35 },
];

const branches = [
  { name: "Main Branch", revenue: "$125,678", orders: 1234, target: "$100,000", achievement: 126 },
  { name: "Branch A", revenue: "$98,456", orders: 987, target: "$80,000", achievement: 123 },
  { name: "Branch B", revenue: "$76,543", orders: 765, target: "$70,000", achievement: 109 },
  { name: "Branch C", revenue: "$54,321", orders: 543, target: "$50,000", achievement: 109 },
];

const salesReps = [
  { name: "John Doe", sales: 234, revenue: "$12,345", target: "$10,000", achievement: 123 },
  { name: "Jane Smith", sales: 198, revenue: "$10,876", target: "$10,000", achievement: 109 },
  { name: "Mike Johnson", sales: 187, revenue: "$9,654", target: "$8,000", achievement: 121 },
  { name: "Sarah Wilson", sales: 165, revenue: "$8,432", target: "$8,000", achievement: 105 },
  { name: "Tom Brown", sales: 143, revenue: "$7,654", target: "$7,000", achievement: 109 },
];

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("revenue");
  const maxRevenue = Math.max(...revenueData.map(d => d.value));
  
  const tabs = [
    { id: "revenue", label: "Revenue", icon: BarChart3 },
    { id: "categories", label: "Categories", icon: PackageIcon },
    { id: "branches", label: "Branches", icon: Store },
    { id: "sales", label: "Sales Reps", icon: UserCheck },
  ];

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View detailed analytics and performance metrics.</p>
        </div>
        <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stat.change}</span>
              <span className="text-gray-400 dark:text-gray-500 ml-1">from last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-900 text-[#003D9B] dark:text-[#0066FF] shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        {activeTab === "revenue" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Over Time</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly revenue for the selected period</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#003D9B] dark:bg-[#0066FF]" />
                  <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                </span>
              </div>
            </div>
            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-[300px]">
              {revenueData.map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-[#003D9B] to-[#0066FF] dark:from-[#0066FF] dark:to-[#8B5CF6] rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(data.value / maxRevenue) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Categories</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Best performing product categories</p>
            </div>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{category.revenue}</p>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{category.growth}</Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#003D9B] to-[#0066FF] rounded-full transition-all"
                      style={{ width: `${category.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "branches" && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Branch Performance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Revenue by branch location</p>
            </div>
            <div className="space-y-4">
              {branches.map((branch, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{branch.name}</p>
                      <p className="text-sm text-gray-500">{branch.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{branch.revenue}</p>
                      <Badge className={branch.achievement >= 100 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}>
                        {branch.achievement}% of target
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${branch.achievement >= 100 ? "bg-emerald-500" : "bg-amber-500"}`}
                      style={{ width: `${Math.min(branch.achievement, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>$0</span>
                    <span>Target: {branch.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sales" && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Rep Performance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Individual sales representative metrics</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Rep</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Sales</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Target</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Achievement</th>
                  </tr>
                </thead>
                <tbody>
                  {salesReps.map((rep, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center text-[#003D9B] dark:text-[#0066FF] text-sm font-semibold">
                            {rep.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{rep.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{rep.sales}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{rep.revenue}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{rep.target}</td>
                      <td className="py-3 px-4">
                        <Badge className={rep.achievement >= 100 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}>
                          {rep.achievement}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}