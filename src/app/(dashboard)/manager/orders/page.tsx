"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, FileText, Package, ClipboardList, Calendar, DollarSign, CheckCircle, Clock, XCircle, RotateCcw } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const mockOrders = [
  { id: "ORD-1234", saleNumber: "SAL-2024-1234", customer: "John Doe", items: 3, total: 234.5, status: "Completed", createdAt: "Oct 15, 2024 10:30 AM" },
  { id: "ORD-1233", saleNumber: "SAL-2024-1233", customer: "Jane Smith", items: 2, total: 156.0, status: "Pending", createdAt: "Oct 15, 2024 10:15 AM" },
  { id: "ORD-1232", saleNumber: "SAL-2024-1232", customer: "Mike Johnson", items: 5, total: 89.99, status: "Completed", createdAt: "Oct 15, 2024 09:45 AM" },
  { id: "ORD-1231", saleNumber: "SAL-2024-1231", customer: "Sarah Wilson", items: 1, total: 450.0, status: "Cancelled", createdAt: "Oct 15, 2024 09:20 AM" },
  { id: "ORD-1230", saleNumber: "SAL-2024-1230", customer: "Tom Brown", items: 4, total: 178.25, status: "Refunded", createdAt: "Oct 14, 2024 06:30 PM" },
  { id: "ORD-1229", saleNumber: "SAL-2024-1229", customer: "Emily Davis", items: 2, total: 320.0, status: "Completed", createdAt: "Oct 14, 2024 05:00 PM" },
  { id: "ORD-1228", saleNumber: "SAL-2024-1228", customer: "Walk-in", items: 1, total: 59.99, status: "Completed", createdAt: "Oct 14, 2024 04:15 PM" },
];

const statusFilters = ["All", "Completed", "Pending", "Cancelled", "Refunded"];

export default function OrdersPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return { label: "Completed", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle };
      case "Pending":
        return { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Clock };
      case "Cancelled":
        return { label: "Cancelled", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle };
      case "Refunded":
        return { label: "Refunded", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400", icon: RotateCcw };
      default:
        return { label: status, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: ClipboardList };
    }
  };

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = search === "" ||
      order.saleNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockOrders.length,
    completed: mockOrders.filter(o => o.status === "Completed").length,
    pending: mockOrders.filter(o => o.status === "Pending").length,
    revenue: mockOrders.filter(o => o.status === "Completed").reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage customer orders</p>
        </div>
        <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${stats.revenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "rounded-xl border",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      )}>
        <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by order # or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "pl-9",
                  isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                )}
              />
            </div>
            <div className="flex gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                    statusFilter === status
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className={cn(isDark ? "bg-gray-800/50" : "bg-gray-50")}>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Order #</TableHead>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Customer</TableHead>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Items</TableHead>
                <TableHead className={cn("text-right", isDark ? "text-gray-400" : "text-gray-600")}>Total</TableHead>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Status</TableHead>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Date</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const status = getStatusBadge(order.status);
                const StatusIcon = status.icon;
                return (
                  <TableRow 
                    key={order.id}
                    className={cn(
                      "transition-colors",
                      isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                    )}
                  >
                    <TableCell className="font-medium font-mono text-gray-900 dark:text-white">{order.saleNumber}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white">{order.customer}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{order.items} items</TableCell>
                    <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("flex items-center gap-1 w-fit", status.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">{order.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
                          <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>Create Invoice</DropdownMenuItem>
                          <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>Print Receipt</DropdownMenuItem>
                          {order.status === "Pending" && (
                            <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>Mark Complete</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}