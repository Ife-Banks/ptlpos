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
  RotateCcw,
  Play,
  CheckCircle,
  ClipboardList,
  Package,
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

const ITEMS_PER_PAGE = 10;

type StocktakeStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "APPLIED";

interface StocktakeItem {
  id: string;
  name: string;
  branchName: string;
  status: StocktakeStatus;
  totalProducts: number;
  countedProducts: number;
  variance: number;
  createdAt: string;
  updatedAt: string;
}

interface StocktakeCount {
  productId: string;
  productName: string;
  systemQuantity: number;
  countedQuantity: number;
  variance: number;
}

interface StocktakeDetail extends StocktakeItem {
  counts: StocktakeCount[];
}

const statusColors: Record<StocktakeStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  APPLIED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const statusLabels: Record<StocktakeStatus, string> = {
  DRAFT: "Draft",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  APPLIED: "Applied",
};

export default function ManagerStocktakePage() {
  const [stocktakes, setStocktakes] = useState<StocktakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCountModalOpen, setIsCountModalOpen] = useState(false);
  const [selectedStocktake, setSelectedStocktake] = useState<StocktakeDetail | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [newStocktake, setNewStocktake] = useState({ name: "", branchId: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [counts, setCounts] = useState<{ productId: string; countedQuantity: number }[]>([]);

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStocktakes();
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

  const loadStocktakes = async () => {
    setLoading(true);
    setError("");
    try {
      const mockStocktakes: StocktakeItem[] = [
        {
          id: "1",
          name: "Monthly Stocktake - April 2026",
          branchName: "Main Store",
          status: "IN_PROGRESS",
          totalProducts: 45,
          countedProducts: 32,
          variance: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Weekly Count - Week 12",
          branchName: "Branch A",
          status: "COMPLETED",
          totalProducts: 28,
          countedProducts: 28,
          variance: 0,
          createdAt: new Date(Date.now() - 604800000).toISOString(),
          updatedAt: new Date(Date.now() - 604800000).toISOString(),
        },
        {
          id: "3",
          name: " Annual Audit 2025",
          branchName: "Main Store",
          status: "APPLIED",
          totalProducts: 120,
          countedProducts: 120,
          variance: -2,
          createdAt: new Date(Date.now() - 2592000000).toISOString(),
          updatedAt: new Date(Date.now() - 2592000000).toISOString(),
        },
      ];
      setStocktakes(mockStocktakes);
      setTotal(mockStocktakes.length);
    } catch (err) {
      setError("Failed to load stocktakes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleCreateStocktake = async () => {
    if (!newStocktake.name || !newStocktake.branchId) {
      setError("Please enter a name and select a branch");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await inventoryApi.createStocktake({
        name: newStocktake.name,
        branchId: newStocktake.branchId,
      });
      setIsCreateModalOpen(false);
      setNewStocktake({ name: "", branchId: "" });
      loadStocktakes();
    } catch (err) {
      setError("Failed to create stocktake");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartStocktake = async (id: string) => {
    try {
      await inventoryApi.startStocktake(id);
      loadStocktakes();
    } catch (err) {
      setError("Failed to start stocktake");
      console.error(err);
    }
  };

  const handleOpenCounts = (stocktake: StocktakeItem) => {
    const detail: StocktakeDetail = {
      ...stocktake,
      counts: [
        { productId: "1", productName: "Widget A", systemQuantity: 100, countedQuantity: 98, variance: -2 },
        { productId: "2", productName: "Gadget X", systemQuantity: 50, countedQuantity: 50, variance: 0 },
        { productId: "3", productName: "Component Y", systemQuantity: 25, countedQuantity: 28, variance: 3 },
      ],
    };
    setSelectedStocktake(detail);
    setCounts(detail.counts.map(c => ({ productId: c.productId, countedQuantity: c.countedQuantity })));
    setIsCountModalOpen(true);
  };

  const updateCount = (productId: string, quantity: number) => {
    setCounts(counts.map(c => 
      c.productId === productId ? { ...c, countedQuantity: quantity } : c
    ));
  };

  const handleSaveCounts = async () => {
    if (!selectedStocktake) return;
    setIsSaving(true);
    try {
      await inventoryApi.recordCounts(selectedStocktake.id, counts);
      setIsCountModalOpen(false);
      setSelectedStocktake(null);
      loadStocktakes();
    } catch (err) {
      setError("Failed to save counts");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyStocktake = async (id: string) => {
    if (!confirm("Are you sure you want to apply this stocktake? This will update inventory levels.")) return;
    try {
      await inventoryApi.applyStocktake(id);
      loadStocktakes();
    } catch (err) {
      setError("Failed to apply stocktake");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Stocktake</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Conduct cycle counts and inventory audits.</p>
        </div>
        <Button 
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Stocktake
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <RotateCcw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Draft</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Applied</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search stocktakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadStocktakes()}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={loadStocktakes}
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
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Stocktake</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Branch</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Progress</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Variance</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Date</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocktakes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No stocktakes found. Create your first stocktake to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  stocktakes.map((stocktake) => (
                    <TableRow key={stocktake.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">{stocktake.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 dark:text-gray-400">{stocktake.branchName}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#003D9B] dark:bg-[#0066FF]" 
                              style={{ width: `${(stocktake.countedProducts / stocktake.totalProducts) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {stocktake.countedProducts}/{stocktake.totalProducts}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={stocktake.variance > 0 ? "text-green-600" : stocktake.variance < 0 ? "text-red-600" : "text-gray-600"}>
                          {stocktake.variance > 0 ? "+" : ""}{stocktake.variance}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[stocktake.status]}>
                          {statusLabels[stocktake.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-500 dark:text-gray-400">
                          {new Date(stocktake.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {stocktake.status === "DRAFT" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-blue-600"
                              onClick={() => handleStartStocktake(stocktake.id)}
                            >
                              <Play className="h-3 w-3 mr-1" /> Start
                            </Button>
                          )}
                          {stocktake.status === "IN_PROGRESS" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7"
                              onClick={() => handleOpenCounts(stocktake)}
                            >
                              Record
                            </Button>
                          )}
                          {stocktake.status === "COMPLETED" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-green-600"
                              onClick={() => handleApplyStocktake(stocktake.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" /> Apply
                            </Button>
                          )}
                        </div>
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
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} stocktakes
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

      {/* Create Stocktake Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Create Stocktake</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Start a new stocktake or cycle count.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stocktake Name *</label>
              <Input
                placeholder="Monthly Stocktake - April 2026"
                value={newStocktake.name}
                onChange={(e) => setNewStocktake({ ...newStocktake, name: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Branch *</label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003D9B] dark:focus:ring-[#0066FF]"
                value={newStocktake.branchId}
                onChange={(e) => setNewStocktake({ ...newStocktake, branchId: e.target.value })}
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateStocktake}
              disabled={isSaving}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Stocktake
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Counts Modal */}
      <Dialog open={isCountModalOpen} onOpenChange={setIsCountModalOpen}>
        <DialogContent className="sm:max-w-[725px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Record Counts</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Enter the counted quantities for each product.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedStocktake && (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="text-gray-600 dark:text-gray-400">Product</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">System Qty</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Counted Qty</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Variance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedStocktake.counts.map((count) => (
                    <TableRow key={count.productId}>
                      <TableCell className="font-medium">{count.productName}</TableCell>
                      <TableCell>{count.systemQuantity}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          className="w-24"
                          value={counts.find(c => c.productId === count.productId)?.countedQuantity || 0}
                          onChange={(e) => updateCount(count.productId, parseInt(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell className={
                        (counts.find(c => c.productId === count.productId)?.countedQuantity || 0) - count.systemQuantity > 0 ? "text-green-600" :
                        (counts.find(c => c.productId === count.productId)?.countedQuantity || 0) - count.systemQuantity < 0 ? "text-red-600" : "text-gray-600"
                      }>
                        {((counts.find(c => c.productId === count.productId)?.countedQuantity || 0) - count.systemQuantity) || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveCounts}
              disabled={isSaving}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Counts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}