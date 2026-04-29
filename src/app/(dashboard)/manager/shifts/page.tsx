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
  Search,
  Loader2,
  Clock,
  DollarSign,
  User,
  Building2,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { shiftsApi, type Shift } from "@/lib/api/shifts";
import { branchesApi } from "@/lib/api/branches";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 20;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "OPEN":
      return { label: "Active", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
    case "CLOSED":
      return { label: "Closed", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
    case "RECONCILED":
      return { label: "Reconciled", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-700" };
  }
};

export default function ManagerShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [newShift, setNewShift] = useState({ openingBalance: "", drawerType: "MIXED", notes: "" });
  const [closingBalance, setClosingBalance] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadShifts();
    loadBranches();
  }, [selectedBranch, statusFilter, currentPage]);

  const loadShifts = async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = { page: currentPage, limit: ITEMS_PER_PAGE };
      if (selectedBranch) params.branchId = selectedBranch;
      if (statusFilter !== "All") params.status = statusFilter;
      
      const response = await shiftsApi.list(params);
      const arr = Array.isArray(response.data) ? response.data : [];
      setShifts(arr);
      setTotal(response.total);
    } catch (err) {
      setError("Failed to load shifts");
      setShifts([]);
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

  const handleOpenShift = async () => {
    setIsProcessing(true);
    try {
      await shiftsApi.open({
        openingBalance: parseFloat(newShift.openingBalance) || 0,
        drawerType: newShift.drawerType as any,
        notes: newShift.notes || undefined,
      });
      setIsOpenModalOpen(false);
      setNewShift({ openingBalance: "", drawerType: "MIXED", notes: "" });
      loadShifts();
    } catch (err) {
      setError("Failed to open shift");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseShift = async () => {
    if (!selectedShift) return;
    setIsProcessing(true);
    try {
      await shiftsApi.close(selectedShift.id, {
        closingBalance: parseFloat(closingBalance) || 0,
      });
      setIsCloseModalOpen(false);
      setSelectedShift(null);
      setClosingBalance("");
      loadShifts();
    } catch (err) {
      setError("Failed to close shift");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReconcileShift = async () => {
    if (!selectedShift) return;
    setIsProcessing(true);
    try {
      await shiftsApi.reconcile(selectedShift.id, {
        actualCash: 0,
        actualCard: 0,
        actualTransfer: 0,
        actualMobile: 0,
      });
      setIsReconcileModalOpen(false);
      setSelectedShift(null);
      loadShifts();
    } catch (err) {
      setError("Failed to reconcile shift");
    } finally {
      setIsProcessing(false);
    }
  };

  const openCloseModal = (shift: Shift) => {
    setSelectedShift(shift);
    setClosingBalance((shift as any).openingBalance || "0");
    setIsCloseModalOpen(true);
  };

  const openReconcileModal = (shift: Shift) => {
    setSelectedShift(shift);
    setIsReconcileModalOpen(true);
  };

  const stats = {
    active: shifts.filter((s) => s.status === "OPEN").length,
    closed: shifts.filter((s) => s.status === "CLOSED").length,
    total: shifts.length,
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Shifts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage staff shifts and drawer reconciliation.</p>
        </div>
        <Button
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
          onClick={() => setIsOpenModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Open Shift
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Shifts</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.closed}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Closed Shifts</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Shifts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search shifts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
          >
            <option value="All">All Status</option>
            <option value="OPEN">Active</option>
            <option value="CLOSED">Closed</option>
            <option value="RECONCILED">Reconciled</option>
          </select>
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
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Staff</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Branch</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium text-right">Opening</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium text-right">Closing</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Started</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No shifts found
                    </TableCell>
                  </TableRow>
                ) : (
                  shifts.map((shift) => {
                    const status = getStatusBadge(shift.status);
                    return (
                      <TableRow key={shift.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center">
                              <User className="h-4 w-4 text-[#003D9B] dark:text-[#0066FF]" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {(shift as any).user?.name || "Staff"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 dark:text-gray-400">
                            {(shift as any).branch?.name || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={status.className}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-gray-900 dark:text-white">
                            ${Number((shift as any).openingBalance || 0).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-gray-900 dark:text-white">
                            ${Number((shift as any).closingBalance || 0).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {shift.createdAt ? new Date(shift.createdAt).toLocaleString() : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {shift.status === "OPEN" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openCloseModal(shift)}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openReconcileModal(shift)}
                                >
                                  Reconcile
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Dialog open={isOpenModalOpen} onOpenChange={setIsOpenModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Open New Shift</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Opening Balance</label>
              <Input
                type="number"
                step="0.01"
                value={newShift.openingBalance}
                onChange={(e) => setNewShift({ ...newShift, openingBalance: e.target.value })}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawer Type</label>
              <select
                value={newShift.drawerType}
                onChange={(e) => setNewShift({ ...newShift, drawerType: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              >
                <option value="MIXED">Mixed Cash</option>
                <option value="CASH">Cash Only</option>
                <option value="ELECTRONIC">Electronic Only</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
              <Input
                value={newShift.notes}
                onChange={(e) => setNewShift({ ...newShift, notes: e.target.value })}
                placeholder="Optional notes..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleOpenShift}
              disabled={isProcessing || !newShift.openingBalance}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90"
            >
              {isProcessing ? "Opening..." : "Open Shift"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCloseModalOpen} onOpenChange={setIsCloseModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Close Shift</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Closing Balance</label>
              <Input
                type="number"
                step="0.01"
                value={closingBalance}
                onChange={(e) => setClosingBalance(e.target.value)}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloseModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCloseShift}
              disabled={isProcessing}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90"
            >
              {isProcessing ? "Closing..." : "Close Shift"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReconcileModalOpen} onOpenChange={setIsReconcileModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reconcile Shift</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to reconcile this shift? This will verify the cash drawer counts.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReconcileModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleReconcileShift}
              disabled={isProcessing}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90"
            >
              {isProcessing ? "Reconciling..." : "Reconcile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}