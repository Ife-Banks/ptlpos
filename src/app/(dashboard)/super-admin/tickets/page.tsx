"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MoreHorizontal, ChevronLeft, ChevronRight, Loader2, AlertCircle, Clock, User, Tag } from "lucide-react";
import { adminApi, type SupportTicket } from "@/lib/api/admin";

const ITEMS_PER_PAGE = 10;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "OPEN":
      return { label: "Open", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    case "IN_PROGRESS":
      return { label: "In Progress", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
    case "RESOLVED":
      return { label: "Resolved", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
    case "CLOSED":
      return { label: "Closed", className: "bg-gray-100 text-gray-600 dark:bg-gray-800" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-700" };
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "URGENT":
      return { label: "Urgent", className: "bg-red-500 text-white" };
    case "HIGH":
      return { label: "High", className: "bg-orange-500 text-white" };
    case "MEDIUM":
      return { label: "Medium", className: "bg-amber-500 text-white" };
    case "LOW":
      return { label: "Low", className: "bg-gray-500 text-white" };
    default:
      return { label: priority, className: "bg-gray-500 text-white" };
  }
};

export default function SuperAdminTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadTickets();
  }, [searchQuery, selectedStatus, selectedPriority, currentPage]);

  const loadTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.listTickets({
        search: searchQuery || undefined,
        status: selectedStatus || undefined,
        priority: selectedPriority || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setTickets(response.data);
      setTotal(response.total);
    } catch (err) {
      setError("Failed to load tickets");
      console.error(err);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage customer support requests.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {selectedStatus || "All Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuItem onClick={() => { setSelectedStatus(null); setCurrentPage(1); }}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedStatus("OPEN"); setCurrentPage(1); }}>OPEN</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedStatus("IN_PROGRESS"); setCurrentPage(1); }}>IN_PROGRESS</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedStatus("RESOLVED"); setCurrentPage(1); }}>RESOLVED</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedStatus("CLOSED"); setCurrentPage(1); }}>CLOSED</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {selectedPriority || "All Priority"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuItem onClick={() => { setSelectedPriority(null); setCurrentPage(1); }}>All Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedPriority("URGENT"); setCurrentPage(1); }}>URGENT</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedPriority("HIGH"); setCurrentPage(1); }}>HIGH</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedPriority("MEDIUM"); setCurrentPage(1); }}>MEDIUM</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedPriority("LOW"); setCurrentPage(1); }}>LOW</DropdownMenuItem>
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

      {/* Tickets Table */}
      {!loading && !error && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Ticket</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Tenant</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Priority</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Created</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => {
                  const statusBadge = getStatusBadge(ticket.status);
                  const priorityBadge = getPriorityBadge(ticket.priority);
                  return (
                    <TableRow key={ticket.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{ticket.subject}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{ticket.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{ticket.tenant?.name || ticket.tenantId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityBadge.className}>{priorityBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "-"}
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Assign</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} tickets
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