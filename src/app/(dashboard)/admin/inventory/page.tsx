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
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inventoryApi } from "@/lib/api/inventory";
import { branchesApi, type Branch } from "@/lib/api/branches";
import { productsApi, type Product } from "@/lib/api/products";

const ITEMS_PER_PAGE = 10;

const statusFilters = ["All", "In Stock", "Low Stock", "Out of Stock"];

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState<any>(null);
  const [adjustQuantity, setAdjustQuantity] = useState("");
  const [adjustType, setAdjustType] = useState<"ADJUSTMENT" | "SALE" | "PURCHASE">("ADJUSTMENT");
  const [adjustNote, setAdjustNote] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadInventory();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedStatus, selectedBranch, currentPage]);

  const loadBranches = async () => {
    try {
      const response = await branchesApi.list({ limit: 100 });
      setBranches(response.data || []);
    } catch (err) {
      console.error("Failed to load branches:", err);
    }
  };

  const loadInventory = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await inventoryApi.list({
        branchId: selectedBranch || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      const arr = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      setInventory(arr);
      setTotal(arr.length);
    } catch (err) {
      setError("Failed to load inventory");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity <= threshold) return { label: "Low Stock", variant: "warning" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const getStatusFilter = (quantity: number, threshold: number) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= threshold) return "Low Stock";
    return "In Stock";
  };

  const stats = {
    total: inventory.length,
    inStock: inventory.filter(i => (i.quantity || 0) > (i.reorderLevel || 0)).length,
    lowStock: inventory.filter(i => (i.quantity || 0) <= (i.reorderLevel || 0) && (i.quantity || 0) > 0).length,
    outOfStock: inventory.filter(i => (i.quantity || 0) === 0).length,
  };

  const handleAdjustStock = async () => {
    if (!adjustProduct || !adjustQuantity) {
      setError("Please fill in required fields");
      return;
    }
    setIsAdjusting(true);
    setError("");
    try {
      await inventoryApi.adjust({
        productId: adjustProduct.productId || adjustProduct.id,
        branchId: adjustProduct.branchId || selectedBranch || "",
        quantity: parseInt(adjustQuantity),
        type: adjustType,
        note: adjustNote || undefined,
      });
      setShowAdjustModal(false);
      setAdjustProduct(null);
      setAdjustQuantity("");
      setAdjustType("ADJUSTMENT");
      setAdjustNote("");
      loadInventory();
    } catch (err) {
      setError("Failed to adjust stock");
      console.error(err);
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage stock levels across branches</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedBranch || ""} onValueChange={(v) => { setSelectedBranch(v === "__all__" ? null : v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <SelectItem value="__all__">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Stock</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.inStock}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Out of Stock</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <div className="flex gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedStatus === status
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
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
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Product</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">SKU</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Branch</TableHead>
                  <TableHead className="text-right text-gray-600 dark:text-gray-400 font-medium">Quantity</TableHead>
                  <TableHead className="text-right text-gray-600 dark:text-gray-400 font-medium">Reorder Level</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-right text-gray-600 dark:text-gray-400 font-medium">Last Updated</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No inventory found.
                    </TableCell>
                  </TableRow>
                ) : (
                  inventory.map((item) => {
                    const status = getStockStatus(item.quantity || 0, item.reorderLevel || 0);
                    return (
                      <TableRow key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium text-gray-900 dark:text-white">{item.productName || item.product?.name}</TableCell>
                        <TableCell className="font-mono text-gray-600 dark:text-gray-400">{item.productSku || item.product?.sku}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{item.branchName || item.branch?.name}</TableCell>
                        <TableCell className="text-right font-medium text-gray-900 dark:text-white">{item.quantity || 0}</TableCell>
                        <TableCell className="text-right text-gray-500 dark:text-gray-400">{item.reorderLevel || 0}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={status.variant}
                            className={
                              status.variant === "default" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                              status.variant === "warning" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }
                          >
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-gray-500 dark:text-gray-400">
                          {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                              <DropdownMenuItem onClick={() => { setAdjustProduct(item); setShowAdjustModal(true); }}>
                                Adjust Stock
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
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} items
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-200 dark:border-gray-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-[#003D9B] dark:bg-[#0066FF] text-white" : "border-gray-200 dark:border-gray-700"}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-gray-200 dark:border-gray-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={showAdjustModal} onOpenChange={(open) => {
        setShowAdjustModal(open);
        if (!open) {
          setAdjustProduct(null);
          setError("");
        }
      }}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Adjust Stock</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Manually adjust inventory quantity for {adjustProduct?.productName || adjustProduct?.product?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity *</label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={adjustQuantity}
                onChange={(e) => setAdjustQuantity(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="adjustType" className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <Select value={adjustType} onValueChange={(v) => setAdjustType(v as typeof adjustType)}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                  <SelectItem value="SALE">Sale</SelectItem>
                  <SelectItem value="PURCHASE">Purchase</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="note" className="text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
              <Input
                id="note"
                placeholder="Reason for adjustment"
                value={adjustNote}
                onChange={(e) => setAdjustNote(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              onClick={handleAdjustStock}
              disabled={isAdjusting}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
            >
              {isAdjusting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Adjust Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}