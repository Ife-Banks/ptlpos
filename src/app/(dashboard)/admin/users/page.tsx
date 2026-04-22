"use client";

import { useState } from "react";
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
  Mail,
  Building2,
  Calendar,
  MoreHorizontal,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1 234 567 8900", role: "ADMIN", status: "active", branch: "Main Branch", createdAt: "Jan 15, 2024" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1 234 567 8901", role: "MANAGER", status: "active", branch: "Branch A", createdAt: "Feb 20, 2024" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", phone: "+1 234 567 8902", role: "SALES_REP", status: "active", branch: "Branch B", createdAt: "Mar 10, 2024" },
  { id: "4", name: "Sarah Wilson", email: "sarah@example.com", phone: "+1 234 567 8903", role: "MANAGER", status: "inactive", branch: "Main Branch", createdAt: "Mar 25, 2024" },
  { id: "5", name: "Tom Brown", email: "tom@example.com", phone: "+1 234 567 8904", role: "SALES_REP", status: "active", branch: "Branch A", createdAt: "Apr 05, 2024" },
  { id: "6", name: "Emily Davis", email: "emily@example.com", phone: "+1 234 567 8905", role: "SALES_REP", status: "active", branch: "Branch C", createdAt: "Apr 15, 2024" },
  { id: "7", name: "Chris Lee", email: "chris@example.com", phone: "+1 234 567 8906", role: "MANAGER", status: "active", branch: "Main Branch", createdAt: "May 01, 2024" },
  { id: "8", name: "Amanda Garcia", email: "amanda@example.com", phone: "+1 234 567 8907", role: "SALES_REP", status: "inactive", branch: "Branch B", createdAt: "May 10, 2024" },
  { id: "9", name: "David Kim", email: "david@example.com", phone: "+1 234 567 8908", role: "SALES_REP", status: "active", branch: "Branch A", createdAt: "May 15, 2024" },
  { id: "10", name: "Lisa Wang", email: "lisa@example.com", phone: "+1 234 567 8909", role: "MANAGER", status: "active", branch: "Main Branch", createdAt: "May 20, 2024" },
];

const roles = ["ADMIN", "MANAGER", "SALES_REP"];
const statuses = ["active", "inactive"];
const ITEMS_PER_PAGE = 5;

const getRoleBadge = (role: string) => {
  switch (role) {
    case "ADMIN":
      return { label: "Admin", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "MANAGER":
      return { label: "Manager", className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" };
    case "SALES_REP":
      return { label: "Sales Rep", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
    default:
      return { label: role, className: "bg-gray-100 text-gray-700" };
  }
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesStatus = !selectedStatus || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage user accounts and permissions.</p>
        </div>
        <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Filter className="mr-2 h-4 w-4" />
                {selectedRole || "All Roles"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuItem onClick={() => { setSelectedRole(null); setCurrentPage(1); }}>All Roles</DropdownMenuItem>
              {roles.map((role) => (
                <DropdownMenuItem key={role} onClick={() => { setSelectedRole(role); setCurrentPage(1); }}>{role}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Filter className="mr-2 h-4 w-4" />
                {selectedStatus ? selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1) : "All Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuItem onClick={() => { setSelectedStatus(null); setCurrentPage(1); }}>All Status</DropdownMenuItem>
              {statuses.map((status) => (
                <DropdownMenuItem key={status} onClick={() => { setSelectedStatus(status); setCurrentPage(1); }}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <TableHead className="text-gray-600 dark:text-gray-400 font-medium">User</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Role</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Branch</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Status</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Created</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => {
                const roleBadge = getRoleBadge(user.role);
                return (
                  <TableRow key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center text-[#003D9B] dark:text-[#0066FF] text-sm font-semibold">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleBadge.className}>{roleBadge.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Building2 className="h-4 w-4" />
                        {user.branch}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {user.createdAt}
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
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>{user.status === "active" ? "Deactivate" : "Activate"}</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
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
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
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
      </div>
    </div>
  );
}