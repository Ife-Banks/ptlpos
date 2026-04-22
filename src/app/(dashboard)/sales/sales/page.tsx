"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  MoreHorizontal,
  FileText,
  ShoppingCart,
  Loader2,
  Eye,
  Printer,
  Receipt,
  DollarSign,
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
import { cn } from "@/lib/utils";

const mockSales = [
  { id: "1", saleNumber: "INV-2024-001", customer: "John Doe", items: 5, subtotal: 12500, total: 13437.50, status: "COMPLETED", createdAt: "Oct 22, 2024 10:30 AM", payment: "CASH" },
  { id: "2", saleNumber: "INV-2024-002", customer: "Jane Smith", items: 3, subtotal: 8900, total: 9567.50, status: "COMPLETED", createdAt: "Oct 22, 2024 09:15 AM", payment: "CARD" },
  { id: "3", saleNumber: "INV-2024-003", customer: "Walk-in Customer", items: 2, subtotal: 450, total: 483.75, status: "HELD", createdAt: "Oct 22, 2024 11:45 AM", payment: "-" },
  { id: "4", saleNumber: "INV-2024-004", customer: "Mike Johnson", items: 8, subtotal: 23400, total: 25155.00, status: "PENDING", createdAt: "Oct 21, 2024 04:20 PM", payment: "CARD" },
  { id: "5", saleNumber: "INV-2024-005", customer: "Sarah Wilson", items: 4, subtotal: 6700, total: 7202.50, status: "COMPLETED", createdAt: "Oct 21, 2024 02:30 PM", payment: "CASH" },
  { id: "6", saleNumber: "INV-2024-006", customer: "Tom Brown", items: 6, subtotal: 15600, total: 16770.00, status: "REFUNDED", createdAt: "Oct 20, 2024 01:00 PM", payment: "CARD" },
  { id: "7", saleNumber: "INV-2024-007", customer: "Emily Davis", items: 1, subtotal: 299, total: 321.43, status: "HELD", createdAt: "Oct 22, 2024 12:00 PM", payment: "-" },
  { id: "8", saleNumber: "INV-2024-008", customer: "Chris Lee", items: 7, subtotal: 18900, total: 20317.50, status: "COMPLETED", createdAt: "Oct 20, 2024 11:00 AM", payment: "CARD" },
];

const statusFilters = [
  { value: "all", label: "All Sales", icon: FileText },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle },
  { value: "HELD", label: "Held", icon: Pause },
  { value: "PENDING", label: "Pending", icon: Clock },
  { value: "REFUNDED", label: "Refunded", icon: RotateCcw },
];

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredSales = mockSales.filter((sale) => {
    const matchesSearch = searchQuery === "" ||
      sale.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      COMPLETED: { bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", text: "Completed" },
      HELD: { bg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", text: "Held" },
      PENDING: { bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", text: "Pending" },
      REFUNDED: { bg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", text: "Refunded" },
      CANCELLED: { bg: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", text: "Cancelled" },
    };
    return styles[status] || styles.PENDING;
  };

  const stats = {
    all: mockSales.length,
    completed: mockSales.filter((s) => s.status === "COMPLETED").length,
    held: mockSales.filter((s) => s.status === "HELD").length,
    pending: mockSales.filter((s) => s.status === "PENDING").length,
    refunded: mockSales.filter((s) => s.status === "REFUNDED").length,
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Sales", value: stats.all, color: "blue" },
          { label: "Completed", value: stats.completed, color: "emerald" },
          { label: "Held", value: stats.held, color: "amber" },
          { label: "Pending", value: stats.pending, color: "blue" },
          { label: "Refunded", value: stats.refunded, color: "red" },
        ].map((stat, i) => (
          <div
            key={i}
            className={cn(
              "bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 cursor-pointer transition-all",
              statusFilter === (stat.label === "Total Sales" ? "all" : stat.label.toUpperCase()) && "ring-2 ring-[#003D9B] dark:ring-[#0066FF]"
            )}
            onClick={() => setStatusFilter(stat.label === "Total Sales" ? "all" : stat.label.toUpperCase())}
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by invoice # or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex overflow-x-auto gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
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
              {filter.value === "all" ? stats.all : stats[filter.value.toLowerCase() as keyof typeof stats] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
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
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
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
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{sale.customer}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{sale.items} items</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white">${sale.total.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusBadge(sale.status).bg, getStatusBadge(sale.status).text)}>
                        {getStatusBadge(sale.status).text}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {sale.payment}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">{sale.createdAt}</td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Print Receipt
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Create Invoice
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