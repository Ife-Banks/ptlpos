"use client";

import { useState } from "react";
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
import { Plus, Search, MoreHorizontal, Package, Users, FileText, CheckCircle, Clock, XCircle, ArrowRight, Truck } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const mockPurchaseOrders = [
  { id: "PO-001", supplier: "Acme Supplies Ltd", items: 5, total: 2340.0, status: "Pending", createdAt: "Oct 15, 2024" },
  { id: "PO-002", supplier: "Tech Components Inc", items: 12, total: 5670.0, status: "Completed", createdAt: "Oct 14, 2024" },
  { id: "PO-003", supplier: "Global Parts Co", items: 8, total: 1890.0, status: "Pending", createdAt: "Oct 13, 2024" },
  { id: "PO-004", supplier: "Prime Materials", items: 3, total: 890.0, status: "Completed", createdAt: "Oct 12, 2024" },
];

const mockSuppliers = [
  { id: "1", name: "Acme Supplies Ltd", email: "orders@acme.com", phone: "+1 234 567 8900", products: 45, lastOrder: "Oct 15, 2024" },
  { id: "2", name: "Tech Components Inc", email: "sales@techcomp.com", phone: "+1 234 567 8901", products: 123, lastOrder: "Oct 14, 2024" },
  { id: "3", name: "Global Parts Co", email: "info@globalparts.com", phone: "+1 234 567 8902", products: 67, lastOrder: "Oct 13, 2024" },
  { id: "4", name: "Prime Materials", email: "orders@primemat.com", phone: "+1 234 567 8903", products: 23, lastOrder: "Oct 12, 2024" },
];

export default function PurchasesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return { label: "Completed", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle };
      case "Pending":
        return { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Clock };
      case "Cancelled":
        return { label: "Cancelled", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle };
      default:
        return { label: status, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: Clock };
    }
  };

  const stats = {
    totalOrders: mockPurchaseOrders.length,
    pending: mockPurchaseOrders.filter(o => o.status === "Pending").length,
    totalValue: mockPurchaseOrders.reduce((sum, o) => sum + o.total, 0),
    suppliers: mockSuppliers.length,
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
              <p className="text-xl font-bold text-gray-900 dark:text-white">${stats.totalValue.toFixed(2)}</p>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search purchase orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    "pl-9 max-w-md",
                    isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                  )}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
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
                  {mockPurchaseOrders.map((po) => {
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
                        <TableCell className="font-medium font-mono text-gray-900 dark:text-white">{po.id}</TableCell>
                        <TableCell className="text-gray-900 dark:text-white">{po.supplier}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{po.items} items</TableCell>
                        <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                          ${po.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("flex items-center gap-1 w-fit", status.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-400">{po.createdAt}</TableCell>
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
              <Table>
                <TableHeader>
                  <TableRow className={cn(isDark ? "bg-gray-800/50" : "bg-gray-50")}>
                    <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Name</TableHead>
                    <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Email</TableHead>
                    <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Phone</TableHead>
                    <TableHead className={cn("text-right", isDark ? "text-gray-400" : "text-gray-600")}>Products</TableHead>
                    <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Last Order</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSuppliers.map((supplier) => (
                    <TableRow 
                      key={supplier.id}
                      className={cn(
                        "transition-colors",
                        isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                      )}
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-white">{supplier.name}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{supplier.email}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{supplier.phone}</TableCell>
                      <TableCell className="text-right text-gray-900 dark:text-white">{supplier.products}</TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400">{supplier.lastOrder}</TableCell>
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}