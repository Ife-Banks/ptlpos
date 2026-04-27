"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowLeftRight,
  ArrowRight,
  Package,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { inventoryApi } from "@/lib/api/inventory";
import { branchesApi, type Branch } from "@/lib/api/branches";
import { productsApi, type Product } from "@/lib/api/products";

const ITEMS_PER_PAGE = 10;

type TransferStatus = "PENDING" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED";

interface TransferItem {
  id: string;
  fromBranch: { name: string };
  toBranch: { name: string };
  items: { productId: string; productName: string; quantity: number }[];
  status: TransferStatus;
  createdAt: string;
}

const statusColors: Record<TransferStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  IN_TRANSIT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ManagerTransfersPage() {
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newTransfer, setNewTransfer] = useState({
    fromBranchId: "",
    toBranchId: "",
    items: [] as { productId: string; quantity: number }[],
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadBranches();
    loadProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTransfers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const loadBranches = async () => {
    try {
      const response = await branchesApi.list({ limit: 100 });
      setBranches(response.data || []);
    } catch (err) {
      console.error("Failed to load branches:", err);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsApi.list({ limit: 100 });
      setProducts(response.data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const loadTransfers = async () => {
    setLoading(true);
    setError("");
    try {
      const mockTransfers: TransferItem[] = [
        {
          id: "1",
          fromBranch: { name: "Main Store" },
          toBranch: { name: "Branch B" },
          items: [
            { productId: "1", productName: "Widget A", quantity: 10 },
            { productId: "2", productName: "Gadget X", quantity: 5 },
          ],
          status: "PENDING",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          fromBranch: { name: "Branch A" },
          toBranch: { name: "Main Store" },
          items: [
            { productId: "3", productName: "Component Y", quantity: 20 },
          ],
          status: "COMPLETED",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setTransfers(mockTransfers);
      setTotal(mockTransfers.length);
    } catch (err) {
      setError("Failed to load transfers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleCreateTransfer = async () => {
    if (!newTransfer.fromBranchId || !newTransfer.toBranchId) {
      setError("Please select source and destination branches");
      return;
    }
    if (newTransfer.items.length === 0) {
      setError("Please add at least one product");
      return;
    }
    if (newTransfer.fromBranchId === newTransfer.toBranchId) {
      setError("Source and destination branches must be different");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await inventoryApi.transfer({
        fromBranchId: newTransfer.fromBranchId,
        toBranchId: newTransfer.toBranchId,
        items: newTransfer.items,
      });
      setIsCreateModalOpen(false);
      setNewTransfer({
        fromBranchId: "",
        toBranchId: "",
        items: [],
      });
      loadTransfers();
    } catch (err) {
      setError("Failed to create transfer");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const addTransferItem = () => {
    setNewTransfer({
      ...newTransfer,
      items: [...newTransfer.items, { productId: "", quantity: 1 }],
    });
  };

  const updateTransferItem = (index: number, field: "productId" | "quantity", value: string | number) => {
    const updatedItems = [...newTransfer.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewTransfer({ ...newTransfer, items: updatedItems });
  };

  const removeTransferItem = (index: number) => {
    const updatedItems = newTransfer.items.filter((_, i) => i !== index);
    setNewTransfer({ ...newTransfer, items: updatedItems });
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Inventory Transfers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Transfer stock between branches.</p>
        </div>
        <Button 
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Transfer
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <ArrowLeftRight className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Transit</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search transfers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadTransfers()}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={loadTransfers}
            className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <Search className="mr-2 h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Search</span>
          </Button>
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
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Transfer</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">From → To</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Items</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Date</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No transfers found. Create your first transfer to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  transfers.map((transfer) => (
                    <TableRow key={transfer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ArrowLeftRight className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">TRF-{transfer.id.padStart(4, "0")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{transfer.fromBranch.name}</span>
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{transfer.toBranch.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          {transfer.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                              {item.productName} × {item.quantity}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[transfer.status]}>
                          {transfer.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-500 dark:text-gray-400">
                          {new Date(transfer.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} transfers
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

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[625px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Create Transfer</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Transfer inventory from one branch to another.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From Branch *</label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003D9B] dark:focus:ring-[#0066FF]"
                  value={newTransfer.fromBranchId}
                  onChange={(e) => setNewTransfer({ ...newTransfer, fromBranchId: e.target.value })}
                >
                  <option value="">Select source branch</option>
                  {branches.filter(b => b.id !== newTransfer.toBranchId).map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To Branch *</label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003D9B] dark:focus:ring-[#0066FF]"
                  value={newTransfer.toBranchId}
                  onChange={(e) => setNewTransfer({ ...newTransfer, toBranchId: e.target.value })}
                >
                  <option value="">Select destination branch</option>
                  {branches.filter(b => b.id !== newTransfer.fromBranchId).map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Products *</label>
                <Button variant="outline" size="sm" onClick={addTransferItem}>
                  <Plus className="h-3 w-3 mr-1" /> Add Item
                </Button>
              </div>
              {newTransfer.items.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                  No items added. Click "Add Item" to add products.
                </p>
              ) : (
                <div className="space-y-2">
                  {newTransfer.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        className="flex-1 h-10 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                        value={item.productId}
                        onChange={(e) => updateTransferItem(index, "productId", e.target.value)}
                      >
                        <option value="">Select product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                        ))}
                      </select>
                      <Input
                        type="number"
                        min="1"
                        className="w-20"
                        value={item.quantity}
                        onChange={(e) => updateTransferItem(index, "quantity", parseInt(e.target.value) || 1)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => removeTransferItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateTransfer}
              disabled={isSaving}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}