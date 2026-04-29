"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  MoreHorizontal,
  FileText,
  ShoppingCart,
  Loader2,
  Eye,
  Printer,
  Receipt,
  Clock,
  CheckCircle,
  Pause,
  XCircle,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { salesApi } from "@/lib/api/sales";
import type { Sale, SaleStatus } from "@/types/api";
import { cn } from "@/lib/utils";

const statusFilters = [
  { value: "all", label: "All Sales", icon: FileText },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle },
  { value: "HELD", label: "Held", icon: Pause },
  { value: "ACTIVE", label: "Active", icon: Clock },
  { value: "REFUNDED", label: "Refunded", icon: RotateCcw },
];

const getStatusBadge = (status: SaleStatus) => {
  switch (status) {
    case "ACTIVE":
      return { label: "Active", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "COMPLETED":
      return { label: "Completed", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
    case "HELD":
      return { label: "Held", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
    case "REFUNDED":
      return { label: "Refunded", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    case "CANCELLED":
      return { label: "Cancelled", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-700" };
  }
};

const ITEMS_PER_PAGE = 15;

export default function ManagerSalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

const stats = {
    completed: sales.filter((s) => s.status === "COMPLETED").length,
    held: sales.filter((s) => s.status === "HELD").length,
    active: sales.filter((s) => s.status === "ACTIVE").length,
    refunded: sales.filter((s) => s.status === "REFUNDED").length,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSales();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, currentPage]);

  const loadSales = async () => {
    setLoading(true);
    setError("");
    try {
      const params: { status?: string; page: number; limit: number } = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      const result = await salesApi.list(params);
      const salesData = Array.isArray(result.data) ? result.data : [];
      setSales(salesData);
      setTotal(result.total);
    } catch (err) {
      setError("Failed to load sales");
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadSales();
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      searchQuery === "" ||
      (sale.saleNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((sale as any).customer?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Sales</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage sales and transactions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          <Link href="/sales/pos">
            <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white">
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Sales", value: stats.completed + stats.held + stats.active + stats.refunded, color: "blue" },
          { label: "Completed", value: stats.completed, color: "emerald" },
          { label: "Held", value: stats.held, color: "amber" },
          { label: "Active", value: stats.active, color: "blue" },
          { label: "Refunded", value: stats.refunded, color: "red" },
        ].map((stat, i) => (
          <div
            key={i}
            className={cn(
              "bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 cursor-pointer transition-all",
              statusFilter === (stat.label === "Total Sales" ? "all" : stat.label.toUpperCase()) && "ring-2 ring-[#003D9B] dark:ring-[#0066FF]"
            )}
            onClick={() => {
              setStatusFilter(stat.label === "Total Sales" ? "all" : stat.label.toUpperCase());
              setCurrentPage(1);
            }}
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by invoice # or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => {
              setStatusFilter(filter.value);
              setCurrentPage(1);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              statusFilter === filter.value
                ? "bg-white dark:bg-gray-900 text-[#003D9B] dark:text-[#0066FF] shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <filter.icon className="h-4 w-4" />
            {filter.label}
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold",
              statusFilter === filter.value
                ? "bg-[#003D9B]/10 text-[#003D9B] dark:bg-[#0066FF]/10 dark:text-[#0066FF]"
                : "bg-gray-200 dark:bg-gray-700"
            )}>
              {filter.value === "all" 
                ? stats.completed + stats.held + stats.active + stats.refunded 
                : stats[filter.value.toLowerCase() as keyof typeof stats] || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Invoice #</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Items</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Payment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <Receipt className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No sales found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters or search query</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <span className="font-medium font-mono text-gray-900 dark:text-white">{sale.saleNumber}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{(sale as any).customer?.name || "Walk-in"}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{sale.items?.length || 0} items</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${Number(sale.total || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusBadge(sale.status).className)}>
                        {getStatusBadge(sale.status).label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {sale.paymentMethod || "-"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                      {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
<DropdownMenuContent align="end" className="bg-white dark:bg-gray-900">
                           <Link href={`/manager/sales/${sale.id}`}>
                             <DropdownMenuItem>
                               <Eye className="h-4 w-4 mr-2" />
                               View Details
                             </DropdownMenuItem>
                           </Link>
                           <DropdownMenuItem>
                             <Printer className="h-4 w-4 mr-2" />
                             Print Receipt
                           </DropdownMenuItem>
                          {sale.status === "HELD" && (
                            <DropdownMenuItem>
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Resume Sale
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}