"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, Search, MoreHorizontal, Package, Users, FileText, CheckCircle, Clock, XCircle, ArrowRight, Truck, Loader2 } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { purchaseOrdersApi } from "@/lib/api/purchase-orders";
import { suppliersApi } from "@/lib/api/suppliers";
import type { PurchaseOrder } from "@/lib/api/purchase-orders";
import { cn } from "@/lib/utils";

type POStatus = "DRAFT" | "SENT" | "PARTIAL" | "RECEIVED" | "CANCELLED";

const statusFilters = ["All", "DRAFT", "SENT", "PARTIAL", "RECEIVED", "CANCELLED"];

const getStatusBadge = (status: POStatus) => {
  switch (status) {
    case "RECEIVED":
      return { label: "Completed", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle };
    case "SENT":
      return { label: "Sent", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: ArrowRight };
    case "PARTIAL":
      return { label: "Partial", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Clock };
    case "DRAFT":
      return { label: "Draft", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: Clock };
    case "CANCELLED":
      return { label: "Cancelled", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle };
    default:
      return { label: status, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: Clock };
  }
};

const ITEMS_PER_PAGE = 15;

export default function ManagerPurchasesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPurchaseOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, currentPage]);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadPurchaseOrders = async () => {
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
      const result = await purchaseOrdersApi.list(params);
      const data = Array.isArray(result.data) ? result.data : [];
      setPurchaseOrders(data);
      setTotal(result.total);
    } catch (err) {
      setError("Failed to load purchase orders");
      setPurchaseOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const result = await suppliersApi.list({ page: 1, limit: 100 });
      setSuppliers(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setSuppliers([]);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadPurchaseOrders();
  };

  const stats = {
    totalOrders: total,
    pending: purchaseOrders.filter(o => o.status === "SENT" || o.status === "DRAFT").length,
    totalValue: purchaseOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    suppliers: suppliers.length,
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Purchases</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage purchase orders and suppliers</p>
        </div>
        <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
          <Plus className="mr-2 h-4 w-4" />
          New Purchase Order
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
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
              <ArrowRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${Number(stats.totalValue || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Suppliers</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.suppliers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "rounded-xl border",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      )}>
        <Tabs defaultValue="orders" className="w-full">
          <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
            <TabsList className={cn(
              "bg-gray-100 dark:bg-gray-800",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              <TabsTrigger 
                value="orders" 
                className={cn(
                  "flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white",
                  isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Package className="h-4 w-4" />
                Purchase Orders
              </TabsTrigger>
              <TabsTrigger 
                value="suppliers" 
                className={cn(
                  "flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white",
                  isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Users className="h-4 w-4" />
                Suppliers
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders" className="space-y-0">
            <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search purchase orders..."
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
              ) : purchaseOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No purchase orders found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className={cn(isDark ? "bg-gray-800/50" : "bg-gray-50")}>
                      <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>PO #</TableHead>
                      <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Supplier</TableHead>
                      <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Items</TableHead>
                      <TableHead className={cn("text-right", isDark ? "text-gray-400" : "text-gray-600")}>Total</TableHead>
                      <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Status</TableHead>
                      <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Date</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((po) => {
                      const status = getStatusBadge(po.status);
                      const StatusIcon = status.icon;
                      return (
                        <TableRow 
                          key={po.id}
                          className={cn(
                            "transition-colors",
                            isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                          )}
                        >
                          <TableCell className="font-medium font-mono text-gray-900 dark:text-white">{po.poNumber}</TableCell>
                          <TableCell className="text-gray-900 dark:text-white">{(po as any).supplier?.name || "-"}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{po.items?.length || 0} items</TableCell>
                          <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                            ${Number(po.total || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("flex items-center gap-1 w-fit", status.color)}>
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-500 dark:text-gray-400">
                            {po.createdAt ? new Date(po.createdAt).toLocaleDateString() : "-"}
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
                                <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>Edit Order</DropdownMenuItem>
                                <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>
                                  <Truck className="mr-2 h-4 w-4" />
                                  Receive Items
                                </DropdownMenuItem>
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
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-0">
            <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search suppliers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={cn(
                      "pl-9",
                      isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                    )}
                  />
                </div>
                <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Supplier
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              {suppliers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No suppliers found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className={cn(isDark ? "bg-gray-800/50" : "bg-gray-50")}>
                      <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Name</TableHead>
                      <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Email</TableHead>
                      <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Phone</TableHead>
                      <TableHead className={cn("text-right", isDark ? "text-gray-400" : "text-gray-600")}>Products</TableHead>
                      <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Date</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map((supplier) => (
                      <TableRow 
                        key={supplier.id}
                        className={cn(
                          "transition-colors",
                          isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                        )}
                      >
                        <TableCell className="font-medium text-gray-900 dark:text-white">{supplier.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{supplier.email || "-"}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{supplier.phone || "-"}</TableCell>
                        <TableCell className="text-right text-gray-900 dark:text-white">{supplier.products?.length || 0}</TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-400">
                          {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : "-"}
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
                              <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>View Details</DropdownMenuItem>
                              <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>Create PO</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}