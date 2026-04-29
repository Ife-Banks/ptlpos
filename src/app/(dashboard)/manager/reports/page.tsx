"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Package,
  Receipt,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  ShoppingCart,
} from "lucide-react";
import { branchesApi } from "@/lib/api/branches";
import { analyticsApi, exportsApi } from "@/lib/api/analytics";
import type { DashboardAnalytics } from "@/types/api";
import { cn } from "@/lib/utils";

export default function ManagerReportsPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState("");
  
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedBranch, setSelectedBranch] = useState("");

  useEffect(() => {
    loadData();
  }, [dateRange.from, dateRange.to, selectedBranch]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsData, branchesData] = await Promise.all([
        analyticsApi.getDashboard({
          from: dateRange.from || undefined,
          to: dateRange.to || undefined,
          branchId: selectedBranch || undefined,
        }),
        branchesApi.list({ page: 1, limit: 100 }),
      ]);
      setAnalytics(analyticsData);
      setBranches(Array.isArray(branchesData.data) ? branchesData.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportSales = async () => {
    setExporting("sales");
    try {
      const blob = await analyticsApi.exportSales({
        from: dateRange.from || undefined,
        to: dateRange.to || undefined,
        branchId: selectedBranch || undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setExporting("");
    }
  };

  const handleExportInventory = async () => {
    setExporting("inventory");
    try {
      const blob = await exportsApi.inventory();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inventory-report-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setExporting("");
    }
  };

  const stats = {
    totalRevenue: analytics?.revenue || 0,
    totalSales: analytics?.salesCount || 0,
    totalCustomers: analytics?.customersCount || 0,
    totalProducts: 0,
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View detailed reports and export data.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex gap-2">
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              placeholder="From"
            />
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              placeholder="To"
            />
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <Button variant="outline" onClick={loadData}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${Number(stats.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalSales || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customers</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalCustomers || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Products</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalProducts || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Reports</h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportSales}
              disabled={exporting === "sales"}
            >
              <FileSpreadsheet className="mr-3 h-5 w-5 text-emerald-600" />
              Export Sales Report
              {exporting === "sales" && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportInventory}
              disabled={exporting === "inventory"}
            >
              <FileSpreadsheet className="mr-3 h-5 w-5 text-blue-600" />
              Export Inventory Report
              {exporting === "inventory" && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-500 dark:text-gray-400">Average Order Value</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${stats.totalSales > 0 ? (stats.totalRevenue / stats.totalSales).toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-500 dark:text-gray-400">Sales This Period</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.totalSales}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-500 dark:text-gray-400">Revenue per Customer</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${stats.totalCustomers > 0 ? (stats.totalRevenue / stats.totalCustomers).toFixed(2) : "0.00"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {analytics?.topProducts && analytics.topProducts.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {analytics.topProducts.slice(0, 10).map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#003D9B]/10 dark:bg-[#0066FF]/10 text-[#003D9B] dark:text-[#0066FF] text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{product.productName}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">${Number(product.revenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{product.quantitySold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin h-4 w-4", className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}