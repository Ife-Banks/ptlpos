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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Search, MoreHorizontal, User, Mail, Phone, DollarSign, Loader2, Edit, Trash2, CreditCard } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { customersApi } from "@/lib/api/customers";
import type { Customer } from "@/types/api";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 20;

export default function ManagerCustomersPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [creditAmount, setCreditAmount] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [creditAction, setCreditAction] = useState<"add" | "deduct">("add");

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadCustomers();
  };

  const loadCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await customersApi.list({
        search: search || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      const arr = Array.isArray(response.data) ? response.data : [];
      setCustomers(arr);
      setTotal(response.total);
    } catch (err) {
      setError("Failed to load customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomer = async () => {
    if (!customerForm.name) return;
    setIsSaving(true);
    try {
      if (selectedCustomer) {
        await customersApi.update(selectedCustomer.id, {
          name: customerForm.name,
          email: customerForm.email || undefined,
          phone: customerForm.phone || undefined,
        });
      } else {
        await customersApi.create({
          name: customerForm.name,
          email: customerForm.email || undefined,
          phone: customerForm.phone || undefined,
        });
      }
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      setCustomerForm({ name: "", email: "", phone: "" });
      setSelectedCustomer(null);
      loadCustomers();
    } catch (err) {
      setError("Failed to save customer");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await customersApi.delete(id);
      loadCustomers();
    } catch (err) {
      setError("Failed to delete customer");
    }
  };

  const handleCreditAction = async () => {
    if (!selectedCustomer || !creditAmount) return;
    setIsSaving(true);
    try {
      if (creditAction === "add") {
        await customersApi.addCredit(selectedCustomer.id, {
          amount: parseFloat(creditAmount),
          note: creditNote || undefined,
        });
      } else {
        await customersApi.deductCredit(selectedCustomer.id, {
          amount: parseFloat(creditAmount),
          note: creditNote || undefined,
        });
      }
      setIsCreditModalOpen(false);
      setCreditAmount("");
      setCreditNote("");
      loadCustomers();
    } catch (err) {
      setError("Failed to process credit");
    } finally {
      setIsSaving(false);
    }
  };

  const openCreateModal = () => {
    setCustomerForm({ name: "", email: "", phone: "" });
    setSelectedCustomer(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setCustomerForm({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
    });
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
    setIsCreateModalOpen(true);
  };

  const openCreditModal = (customer: Customer, action: "add" | "deduct") => {
    setSelectedCustomer(customer);
    setCreditAction(action);
    setCreditAmount("");
    setCreditNote("");
    setIsCreditModalOpen(true);
  };

  const filteredCustomers = customers.filter((customer) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(query) ||
      (customer.email || "").toLowerCase().includes(query) ||
      (customer.phone || "").includes(query)
    );
  });

  const stats = {
    total: customers.length,
    totalPurchases: customers.reduce((sum, c) => sum + Number(c.totalPurchases || 0), 0),
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage customer accounts and store credit.</p>
        </div>
        <Button
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
          onClick={openCreateModal}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalPurchases.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Credit</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
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
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Customer</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Email</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Phone</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium text-right">Credit Balance</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Joined</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center">
                            <User className="h-5 w-5 text-[#003D9B] dark:text-[#0066FF]" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 dark:text-gray-400">{customer.email || "-"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 dark:text-gray-400">{customer.phone || "-"}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${Number(customer.creditBalance || 0).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "-"}
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
                            <DropdownMenuItem onClick={() => openEditModal(customer)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openCreditModal(customer, "add")}>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Add Credit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openCreditModal(customer, "deduct")}>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Deduct Credit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCustomer ? "Edit Customer" : "Add Customer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
              <Input
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                placeholder="Customer name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <Input
                type="email"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                placeholder="email@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <Input
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                placeholder="+1 234 567 8900"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveCustomer}
              disabled={!customerForm.name || isSaving}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90"
            >
              {isSaving ? "Saving..." : selectedCustomer ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreditModalOpen} onOpenChange={setIsCreditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{creditAction === "add" ? "Add" : "Deduct"} Store Credit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
              <Input
                type="number"
                step="0.01"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
              <Input
                value={creditNote}
                onChange={(e) => setCreditNote(e.target.value)}
                placeholder="Optional note..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreditModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreditAction}
              disabled={!creditAmount || isSaving}
              className={creditAction === "add" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isSaving ? "Processing..." : creditAction === "add" ? "Add Credit" : "Deduct"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}