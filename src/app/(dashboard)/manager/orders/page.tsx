"use client";

import { useState, useEffect } from "react";
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
import { Plus, Search, MoreHorizontal, FileText, Package, ClipboardList, Calendar, DollarSign, CheckCircle, Clock, XCircle, RotateCcw, Loader2 } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { ordersApi } from "@/lib/api/orders";
import type { Order, OrderStatus } from "@/types/api";
import { cn } from "@/lib/utils";

const statusFilters = ["All", "PENDING", "PARTIAL", "FULFILLED", "CANCELLED"];

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "FULFILLED":
      return { label: "Completed", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle };
    case "PENDING":
      return { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Clock };
    case "PARTIAL":
      return { label: "Partial", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock };
    case "CANCELLED":
      return { label: "Cancelled", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle };
    default:
      return { label: status, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: ClipboardList };
  }
};

const ITEMS_PER_PAGE = 15;

export default function ManagerOrdersPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, currentPage]);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params: { status?: string; page: number; limit: number } = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      if (statusFilter !== "All") {
        params.status = statusFilter;
      }
      const result = await ordersApi.list(params);
      setOrders(Array.isArray(result.data) ? result.data : []);
      setTotal(result.total);
    } catch (err) {
      setError("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadOrders();
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      search === "" ||
      (order.orderNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      ((order as any).customer?.name || "").toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: total,
    completed: orders.filter(o => o.status === "FULFILLED").length,
    pending: orders.filter(o => o.status === "PENDING").length,
    revenue: orders.filter(o => o.status === "FULFILLED").reduce((sum, o) => sum + (o.total || 0), 0),
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
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
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
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No orders found</p>
            </div>
          ) : (
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
                      <TableCell className="font-medium font-mono text-gray-900 dark:text-white">{order.orderNumber}</TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{(order as any).customer?.name || "Walk-in"}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{order.items?.length || 0} items</TableCell>
                      <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                        ${Number(order.total || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("flex items-center gap-1 w-fit", status.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                      </TableCell>
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
                            {order.status === "PENDING" && (
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
          )}
        </div>
      </div>
    </div>
  );
}