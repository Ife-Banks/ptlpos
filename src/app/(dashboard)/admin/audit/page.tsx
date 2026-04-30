"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MoreHorizontal, ChevronLeft, ChevronRight, Loader2, AlertCircle, User, Calendar, Clock, Filter } from "lucide-react";
import { auditApi, type AuditLog } from "@/lib/api/audit";

const ITEMS_PER_PAGE = 15;

const getActionBadge = (action: string) => {
  switch (action) {
    case "CREATE":
      return { label: "Create", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
    case "UPDATE":
      return { label: "Update", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "DELETE":
      return { label: "Delete", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    case "LOGIN":
      return { label: "Login", className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" };
    case "LOGOUT":
      return { label: "Logout", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" };
    case "PATCH":
      return { label: "Patch", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
    default:
      return { label: action, className: "bg-gray-100 text-gray-700" };
  }
};

const actions = ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "PATCH"];
const entities = ["Product", "Sale", "User", "Customer", "Order", "Inventory"];

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    loadLogs();
  }, [selectedAction, selectedEntity, currentPage, dateFrom, dateTo]);

  const loadLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await auditApi.list({
        action: selectedAction || undefined,
        entity: selectedEntity || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setLogs(response.data || []);
      setTotal(response.total || 0);
    } catch (err: any) {
      console.error("Audit API error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load audit logs. The /api/audit endpoint may not be available.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track all system activities and changes.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                placeholder="From Date"
              />
            </div>
            <div>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                placeholder="To Date"
              />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Filter className="mr-2 h-4 w-4" />
                {selectedAction || "All Actions"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuItem onClick={() => { setSelectedAction(null); setCurrentPage(1); }}>All Actions</DropdownMenuItem>
              {actions.map((action) => (
                <DropdownMenuItem key={action} onClick={() => { setSelectedAction(action); setCurrentPage(1); }}>{action}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Filter className="mr-2 h-4 w-4" />
                {selectedEntity || "All Entities"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuItem onClick={() => { setSelectedEntity(null); setCurrentPage(1); }}>All Entities</DropdownMenuItem>
              {entities.map((entity) => (
                <DropdownMenuItem key={entity} onClick={() => { setSelectedEntity(entity); setCurrentPage(1); }}>{entity}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12 text-red-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      )}

      {/* Audit Logs Table */}
      {!loading && !error && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">User</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Action</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Entity</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">IP Address</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const actionBadge = getActionBadge(log.action);
                  return (
                    <TableRow key={log.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{log.userName || log.userId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={actionBadge.className}>{actionBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-900 dark:text-white">{log.entity}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-cyan-600 dark:text-cyan-400 font-mono text-sm">{log.ipAddress || "-"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} logs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-[#003D9B] dark:bg-[#0066FF] text-white" : ""}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}