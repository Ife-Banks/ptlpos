"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, Filter, MoreHorizontal, Package, ArrowUpRight, ArrowDownRight, AlertTriangle, Loader2, Minus, PlusCircle } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { inventoryApi } from "@/lib/api/inventory";
import { branchesApi } from "@/lib/api/branches";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 20;

const statusFilters = ["All", "In Stock", "Low Stock", "Out of Stock"];

const getStockStatus = (quantity: number, threshold: number) => {
  if (quantity === 0) return { label: "Out of Stock", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
  if (quantity <= threshold) return { label: "Low Stock", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
  return { label: "In Stock", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
};

export default function ManagerInventoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [inventory, setInventory] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<any>(null);
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const [adjustType, setAdjustType] = useState<"ADJUSTMENT" | "SALE" | "PURCHASE">("ADJUSTMENT");
  const [adjustNote, setAdjustNote] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadInventory();
      loadBranches();
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedBranch, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadInventory();
  };

  const loadInventory = async () => {
    setLoading(true);
    setError("");
    try {
      const branchId = selectedBranch || undefined;
      const response = await inventoryApi.list({ branchId, page: currentPage, limit: ITEMS_PER_PAGE });
      const arr = Array.isArray(response.data) ? response.data : [];
      setInventory(arr);
      setTotal(response.total);
    } catch (err) {
      setError("Failed to load inventory");
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      const response = await branchesApi.list({ page: 1, limit: 100 });
      setBranches(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setBranches([]);
    }
  };

  const handleAdjustInventory = async () => {
    if (!adjustingItem || adjustQuantity === 0) return;
    setIsAdjusting(true);
    try {
      await inventoryApi.adjust({
        productId: adjustingItem.productId,
        branchId: adjustingItem.branchId,
        quantity: adjustQuantity,
        type: adjustType,
        note: adjustNote || undefined,
      });
      setIsAdjustModalOpen(false);
      setAdjustQuantity(0);
      setAdjustNote("");
      loadInventory();
    } catch (err) {
      setError("Failed to adjust inventory");
    } finally {
      setIsAdjusting(false);
    }
  };

  const openAdjustModal = (item: any, type: "add" | "remove") => {
    setAdjustingItem(item);
    setAdjustType(type === "add" ? "PURCHASE" : "ADJUSTMENT");
    setAdjustQuantity(0);
    setAdjustNote("");
    setIsAdjustModalOpen(true);
  };

  const getFilteredInventory = () => {
    let filtered = inventory;
    
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter((item) =>
        (item.productName || item.name || "")?.toLowerCase().includes(query) ||
        (item.sku || "")?.toLowerCase().includes(query)
      );
    }
    
    if (selectedStatus !== "All") {
      filtered = filtered.filter((item) => {
        const qty = item.quantity || 0;
        const threshold = item.lowStockThreshold || 10;
        if (selectedStatus === "Out of Stock") return qty === 0;
        if (selectedStatus === "Low Stock") return qty > 0 && qty <= threshold;
        if (selectedStatus === "In Stock") return qty > threshold;
        return true;
      });
    }
    
    return filtered;
  };

  const stats = {
    all: inventory.length,
    inStock: inventory.filter((i) => (i.quantity || 0) > (i.lowStockThreshold || 10)).length,
    lowStock: inventory.filter((i) => (i.quantity || 0) > 0 && (i.quantity || 0) <= (i.lowStockThreshold || 10)).length,
    outOfStock: inventory.filter((i) => (i.quantity || 0) === 0).length,
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage stock levels across branches.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.all}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inStock}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Stock</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lowStock}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.outOfStock}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Out of Stock</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          <div className="flex gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  selectedStatus === status
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Product</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">SKU</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Branch</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium text-right">Quantity</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Last Updated</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredInventory().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  getFilteredInventory().map((item) => {
                    const threshold = item.lowStockThreshold || 10;
                    const qty = Number(item.quantity || 0);
                    const status = getStockStatus(qty, threshold);
                    return (
                      <TableRow key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {item.productName || item.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-gray-600 dark:text-gray-400">
                            {item.sku || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 dark:text-gray-400">
                            {(item as any).branch?.name || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {qty}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={status.className}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900">
                              <DropdownMenuItem onClick={() => openAdjustModal(item, "add")}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openAdjustModal(item, "remove")}>
                                <Minus className="mr-2 h-4 w-4" />
                                Remove Stock
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Inventory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Product</p>
              <p className="text-gray-900 dark:text-white">{adjustingItem?.productName || adjustingItem?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Quantity</p>
              <p className="text-gray-900 dark:text-white">{adjustingItem?.quantity || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Adjustment Type</p>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value as any)}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              >
                <option value="ADJUSTMENT">Manual Adjustment</option>
                <option value="PURCHASE">Add Purchase</option>
                <option value="SALE">Remove Sale</option>
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity Change</p>
              <Input
                type="number"
                value={adjustQuantity}
                onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Note</p>
              <Input
                value={adjustNote}
                onChange={(e) => setAdjustNote(e.target.value)}
                placeholder="Reason for adjustment..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAdjustInventory}
              disabled={adjustQuantity === 0 || isAdjusting}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90"
            >
              {isAdjusting ? "Saving..." : "Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}