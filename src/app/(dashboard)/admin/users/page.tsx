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
  Mail,
  Calendar,
  MoreHorizontal,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { usersApi } from "@/lib/api/users";
import type { User, UserRole } from "@/types/api";

const roles: UserRole[] = ["ADMIN", "MANAGER", "SALES_REP", "SUPPORT_ADMIN", "BILLING_ADMIN"];
const ITEMS_PER_PAGE = 5;

const getRoleBadge = (role: string) => {
  switch (role) {
    case "ADMIN":
      return { label: "Admin", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "MANAGER":
      return { label: "Manager", className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" };
    case "SALES_REP":
      return { label: "Sales Rep", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
    case "SUPPORT_ADMIN":
      return { label: "Support", className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" };
    case "BILLING_ADMIN":
      return { label: "Billing", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
    default:
      return { label: role, className: "bg-gray-100 text-gray-700" };
  }
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [newRole, setNewRole] = useState<UserRole | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", roleId: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedRole, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers();
  };

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await usersApi.list({
        search: searchQuery || undefined,
        role: selectedRole || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setUsers(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.roleId) {
      setError("Please fill in all fields");
      return;
    }
    setIsCreating(true);
    setError("");
    try {
      await usersApi.create({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.roleId as UserRole,
      });
      setIsCreateModalOpen(false);
      setNewUser({ name: "", email: "", password: "", roleId: "" });
      loadUsers();
    } catch (err) {
      setError("Failed to create user");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser || !editForm.name || !editForm.email) {
      setError("Please fill in all fields");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await usersApi.update(selectedUser.id, {
        name: editForm.name,
        email: editForm.email,
      });
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setEditForm({ name: "", email: "" });
      loadUsers();
    } catch (err) {
      setError("Failed to update user");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !newRole) {
      setError("Please select a role");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await usersApi.update(selectedUser.id, {
        role: newRole,
      });
      setIsRoleModalOpen(false);
      setSelectedUser(null);
      setNewRole(null);
      loadUsers();
    } catch (err) {
      setError("Failed to update role");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({ name: String(user.name), email: String(user.email) });
    setIsEditModalOpen(true);
  };

  const openRoleModal = (user: User) => {
    const currentRole = typeof user.role === 'string' ? user.role : (user as any).role?.name || 'SALES_REP';
    setSelectedUser(user);
    setNewRole(currentRole as UserRole);
    setIsRoleModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await usersApi.delete(userId);
      loadUsers();
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage user accounts and permissions.</p>
        </div>
        <Button 
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
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
                <span className="hidden sm:inline">{selectedRole || "All Roles"}</span>
                <span className="sm:hidden">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuItem onClick={() => { setSelectedRole(null); setCurrentPage(1); }}>All Roles</DropdownMenuItem>
              {roles.map((role) => (
                <DropdownMenuItem key={role} onClick={() => { setSelectedRole(role); setCurrentPage(1); }}>{role}</DropdownMenuItem>
              ))}
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
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">User</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Role</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Created</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const userRole = typeof user.role === 'string' ? user.role : (user as any).role?.name || 'SALES_REP';
                  const roleBadge = getRoleBadge(userRole);
                  return (
                    <TableRow key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center text-[#003D9B] dark:text-[#0066FF] text-sm font-semibold">
                            {String(user.name).split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{String(user.name)}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                              <Mail className="h-3 w-3" />
                              {String(user.email)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleBadge.className}>{String(roleBadge.label)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          {user.createdAt ? new Date(String(user.createdAt)).toLocaleDateString() : "-"}
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
                            <DropdownMenuItem onClick={() => openEditModal(user)}>Edit User</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openRoleModal(user)}>Change Role</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>Delete User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} users
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
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Add New User</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Create a new user account. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003D9B] dark:focus:ring-[#0066FF] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newUser.roleId}
                onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
              >
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleCreateUser}
              disabled={isCreating}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
            >
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Edit User</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Update user information for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="editName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <Input
                id="editName"
                placeholder="John Doe"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="editEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <Input
                id="editEmail"
                type="email"
                placeholder="john@example.com"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="border-gray-200 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditUser}
              disabled={isSaving}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Change Role</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Change the role for {selectedUser?.name}. This will update their permissions immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="newRole" className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <select
                id="newRole"
                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003D9B] dark:focus:ring-[#0066FF] focus:ring-offset-2"
                value={newRole || ""}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
              >
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRoleModalOpen(false)}
              className="border-gray-200 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeRole}
              disabled={isSaving}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}