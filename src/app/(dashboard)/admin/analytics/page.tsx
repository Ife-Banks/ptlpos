"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Loader2,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { analyticsApi, exportsApi } from "@/lib/api/analytics";
import type { DashboardAnalytics } from "@/types/api";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState("revenue");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type: string) => {
    setExporting(true);
    try {
      let blob;
      if (type === "products") blob = await exportsApi.products();
      else if (type === "customers") blob = await exportsApi.customers();
      else if (type === "inventory") blob = await exportsApi.inventory();
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}_export.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const tabs = [
    { id: "revenue", label: "Revenue", icon: BarChart3 },
    { id: "categories", label: "Categories", icon: PackageIcon },
    { id: "branches", label: "Branches", icon: Store },
    { id: "sales", label: "Sales Reps", icon: UserCheck },
  ];

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await analyticsApi.getDashboard({
        from: dateRange.from,
        to: dateRange.to,
      });
      setAnalytics(data);
    } catch (err) {
      setError("Failed to load analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Revenue",
      value: analytics?.revenue ? `$${analytics.revenue.toLocaleString()}` : "$0",
      change: analytics?.revenueChange != null ? `${analytics.revenueChange >= 0 ? "+" : ""}${analytics.revenueChange.toFixed(1)}%` : "0%",
      icon: DollarSign,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      isPositive: analytics?.revenueChange != null ? analytics.revenueChange >= 0 : true,
    },
    {
      title: "Total Orders",
      value: analytics?.salesCount != null ? analytics.salesCount.toLocaleString() : "0",
      change: analytics?.salesCountChange != null ? `${analytics.salesCountChange >= 0 ? "+" : ""}${analytics.salesCountChange.toFixed(1)}%` : "0%",
      icon: ShoppingCart,
      color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
      isPositive: analytics?.salesCountChange != null ? analytics.salesCountChange >= 0 : true,
    },
    {
      title: "Total Customers",
      value: analytics?.customersCount != null ? analytics.customersCount.toLocaleString() : "0",
      change: analytics?.customersCountChange != null ? `${analytics.customersCountChange >= 0 ? "+" : ""}${analytics.customersCountChange.toFixed(1)}%` : "0%",
      icon: Users,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      isPositive: analytics?.customersCountChange != null ? analytics.customersCountChange >= 0 : true,
    },
    {
      title: "Products Sold",
      value: analytics?.topProducts ? analytics.topProducts.reduce((sum, p) => sum + (p.quantitySold || 0), 0).toLocaleString() : "0",
      change: "+8.2%",
      icon: Package,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      isPositive: true,
    },
  ];

  const maxRevenue = analytics?.salesTrend && analytics.salesTrend.length > 0
    ? Math.max(...analytics.salesTrend.map((d) => d.revenue || 0))
    : 0;

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View detailed analytics and performance metrics.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
              disabled={exporting}
            >
              {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Export Report
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <DropdownMenuItem onClick={() => handleExport("products")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Products
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("customers")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Customers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("inventory")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Inventory
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <Input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="w-40 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
          <span className="text-gray-500">to</span>
          <Input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="w-40 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {!loading && !error && (
        <>
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
                  {stat.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={stat.isPositive ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"}>
                    {stat.change}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 ml-1">from last period</span>
                </div>
              </div>
            ))}
          </div>

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

          {activeTab === "revenue" && analytics?.salesTrend && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.salesTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280" 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#6B7280" 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#003D9B" 
                      strokeWidth={2}
                      dot={{ fill: '#003D9B', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#003D9B' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "categories" && analytics?.topProducts && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
              <div className="space-y-4">
                {analytics.topProducts.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No products found</p>
                ) : (
                  analytics.topProducts.map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">{index + 1}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{product.productName}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">${product.revenue?.toLocaleString()}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{product.quantitySold} sold</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "branches" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Branch Performance</h3>
              <p className="text-gray-500 dark:text-gray-400">Select a branch to view performance</p>
            </div>
          )}

          {activeTab === "sales" && analytics?.staffPerformance && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Rep Performance</h3>
              <div className="space-y-4">
                {analytics.staffPerformance.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No data found</p>
                ) : (
                  analytics.staffPerformance.map((staff, index) => (
                    <div key={staff.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">{index + 1}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{staff.userName}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">${staff.totalRevenue?.toLocaleString()}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{staff.salesCount} sales</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}