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
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  DollarSign,
  User,
  Building2,
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
import { shiftsApi, type Shift } from "@/lib/api/shifts";

const ITEMS_PER_PAGE = 10;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "OPEN":
      return { label: "Open", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
    case "CLOSED":
      return { label: "Closed", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-700" };
  }
};

export default function AdminShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeShifts, setActiveShifts] = useState<Shift[]>([]);
  const [showActiveModal, setShowActiveModal] = useState(false);
  
  // Shift detail modal
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Close shift modal
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closingBalance, setClosingBalance] = useState("");
  const [closeNotes, setCloseNotes] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  
  // Reconcile modal
  const [showReconcileModal, setShowReconcileModal] = useState(false);
  const [actualCash, setActualCash] = useState("");
  const [actualCard, setActualCard] = useState("");
  const [actualTransfer, setActualTransfer] = useState("");
  const [actualMobile, setActualMobile] = useState("");
  const [reconcileNotes, setReconcileNotes] = useState("");
  const [isReconciling, setIsReconciling] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadShifts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedStatus, selectedBranch, fromDate, toDate, currentPage]);

  const loadActiveShifts = async () => {
    try {
      const data = await shiftsApi.getActive();
      setActiveShifts(data);
      setShowActiveModal(true);
    } catch (err) {
      console.error("Failed to load active shifts:", err);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadShifts();
  };

  const loadShifts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await shiftsApi.list({
        status: selectedStatus || undefined,
        branchId: selectedBranch || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setShifts(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError("Failed to load shifts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // View shift details
  const handleViewDetails = async (shift: Shift) => {
    try {
      const data = await shiftsApi.get(shift.id);
      setSelectedShift(data);
      setShowDetailModal(true);
    } catch (err) {
      setError("Failed to load shift details");
      console.error(err);
    }
  };

  // Close shift
  const handleCloseShift = async () => {
    if (!closingBalance) {
      setError("Please enter closing balance");
      return;
    }
    if (!selectedShift) return;
    setIsClosing(true);
    setError("");
    try {
      await shiftsApi.close(selectedShift.id, {
        closingBalance: parseFloat(closingBalance),
        notes: closeNotes || undefined,
      });
      setShowCloseModal(false);
      setClosingBalance("");
      setCloseNotes("");
      loadShifts();
    } catch (err) {
      setError("Failed to close shift");
      console.error(err);
    } finally {
      setIsClosing(false);
    }
  };

  // Reconcile shift
  const handleReconcileShift = async () => {
    if (!actualCash) {
      setError("Please enter actual cash count");
      return;
    }
    if (!selectedShift) return;
    setIsReconciling(true);
    setError("");
    try {
      await shiftsApi.reconcile(selectedShift.id, {
        actualCash: parseFloat(actualCash) || 0,
        actualCard: parseFloat(actualCard) || 0,
        actualTransfer: parseFloat(actualTransfer) || 0,
        actualMobile: parseFloat(actualMobile) || 0,
        notes: reconcileNotes || undefined,
      });
      setShowReconcileModal(false);
      setActualCash("");
      setActualCard("");
      setActualTransfer("");
      setActualMobile("");
      setReconcileNotes("");
      loadShifts();
    } catch (err) {
      setError("Failed to reconcile shift");
      console.error(err);
    } finally {
      setIsReconciling(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Shifts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage staff shifts and cash drawer.</p>
        </div>
        <Button 
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
          onClick={loadActiveShifts}
        >
          <Clock className="mr-2 h-4 w-4" />
          View Active Shifts
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search shifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleSearch}
            className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <Search className="mr-2 h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Filter className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{selectedStatus || "All Status"}</span>
                <span className="sm:hidden">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuItem onClick={() => { setSelectedStatus(null); setCurrentPage(1); }}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedStatus("OPEN"); setCurrentPage(1); }}>Open</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedStatus("CLOSED"); setCurrentPage(1); }}>Closed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Staff</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Branch</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Opening</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Closing</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Started</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No shifts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  shifts.map((shift) => {
                    const statusBadge = getStatusBadge(shift.status);
                    return (
                      <TableRow key={shift.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center text-[#003D9B] dark:text-[#0066FF] text-xs font-semibold">
                              {String(shift.userName || "U").split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="text-gray-900 dark:text-white">{String(shift.userName || "Unknown")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 dark:text-gray-400">{String(shift.branchName || "Unknown")}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 dark:text-gray-400">${String(shift.openingBalance)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 dark:text-gray-400">
                            {shift.closingBalance ? `$${shift.closingBalance}` : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            {shift.openedAt ? new Date(String(shift.openedAt)).toLocaleDateString() : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
<DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                              <DropdownMenuItem onClick={() => handleViewDetails(shift)}>View Details</DropdownMenuItem>
                              {shift.status === "OPEN" && (
                                <DropdownMenuItem onClick={() => { setSelectedShift(shift); setShowCloseModal(true); }}>
                                  Close Shift
                                </DropdownMenuItem>
                              )}
                              {shift.status === "CLOSED" && (
                                <DropdownMenuItem onClick={() => { setSelectedShift(shift); setShowReconcileModal(true); }}>
                                  Reconcile
                                </DropdownMenuItem>
                              )}
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
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} shifts
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

      {/* Active Shifts Modal */}
      <Dialog open={showActiveModal} onOpenChange={setShowActiveModal}>
        <DialogContent className="sm:max-w-[525px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Active Shifts</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Currently open shifts across all branches.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {activeShifts.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No active shifts</p>
            ) : (
              activeShifts.map((shift) => (
                <div key={shift.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{String(shift.userName)}</span>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">OPEN</Badge>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>Branch: {String(shift.branchName)}</p>
                    <p>Opening: ${shift.openingBalance}</p>
                    <p>Drawer: {shift.drawerType}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}