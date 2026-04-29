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
  MoreHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Users,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { customersApi } from "@/lib/api/customers";
import type { Customer } from "@/types/api";

const ITEMS_PER_PAGE = 10;

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const [selection, setSelection] = useState<Customer | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [creditAction, setCreditAction] = useState<"add" | "deduct">("add");
  const [isProcessingCredit, setIsProcessingCredit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, currentPage]);

  const loadCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await customersApi.list({
        search: search || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      const arr = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      setCustomers(arr);
      setTotal(arr.length);
    } catch (err) {
      setError("Failed to load customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleSaveCustomer = async () => {
    if (!newCustomer.name) {
      setError("Please enter customer name");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      if (editingCustomer) {
        await customersApi.update(editingCustomer.id, newCustomer);
      } else {
        await customersApi.create(newCustomer);
      }
      setShowModal(false);
      setEditingCustomer(null);
      setNewCustomer({ name: "", email: "", phone: "", address: "" });
      loadCustomers();
    } catch (err) {
      setError("Failed to save customer");
      console.error(err);
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
      console.error(err);
    }
  };

  const handleCreditAction = async () => {
    if (!selection || !creditAmount) {
      setError("Please enter amount");
      return;
    }
    setIsProcessingCredit(true);
    setError("");
    try {
      if (creditAction === "add") {
        await customersApi.addCredit(selection.id, {
          amount: parseFloat(creditAmount),
          note: creditNote || undefined,
        });
      } else {
        await customersApi.deductCredit(selection.id, {
          amount: parseFloat(creditAmount),
          note: creditNote || undefined,
        });
      }
      setShowCreditModal(false);
      setSelection(null);
      setCreditAmount("");
      setCreditNote("");
      loadCustomers();
    } catch (err) {
      setError("Failed to process credit");
      console.error(err);
    } finally {
      setIsProcessingCredit(false);
    }
  };

  const openEditModal = (customer: Customer) => {
    setNewCustomer({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });
    setEditingCustomer(customer);
    setShowModal(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage customer relationships and credit.</p>
        </div>
        <Button 
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
          onClick={() => {
            setNewCustomer({ name: "", email: "", phone: "", address: "" });
            setEditingCustomer(null);
            setShowModal(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
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
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Customer</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Email</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Phone</TableHead>
                  <TableHead className="text-right text-gray-600 dark:text-gray-400 font-medium">Credit Balance</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Joined</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
                            {(customer.name || "U").split(" ").map((n: string) => n[0]).join("")}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {customer.email || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {customer.phone || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${Number((customer as any).creditBalance || 0).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400">
                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                            <DropdownMenuItem onClick={() => { setSelection(customer); setCreditAction("add"); setShowCreditModal(true); }}>
                              Add Credit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelection(customer); setCreditAction("deduct"); setShowCreditModal(true); }}>
                              Deduct Credit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditModal(customer)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteCustomer(customer.id)}
                            >
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} customers
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

      <Dialog open={showModal} onOpenChange={(open) => {
        setShowModal(open);
        if (!open) {
          setEditingCustomer(null);
          setError("");
        }
      }}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {editingCustomer ? "Update customer details." : "Create a new customer account."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
              <Input
                id="name"
                placeholder="Customer name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="customer@email.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <Input
                id="phone"
                placeholder="+1 234 567 8900"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <Input
                id="address"
                placeholder="123 Customer Street"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveCustomer}
              disabled={isSaving}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editingCustomer ? "Update Customer" : "Save Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreditModal} onOpenChange={(open) => {
        setShowCreditModal(open);
        if (!open) {
          setSelection(null);
          setError("");
        }
      }}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {creditAction === "add" ? "Add" : "Deduct"} Credit
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {creditAction === "add" ? "Add store credit to" : "Deduct credit from"} {selection?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="creditAmount" className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount *</label>
              <Input
                id="creditAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="creditNote" className="text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
              <Input
                id="creditNote"
                placeholder="Reason for credit change"
                value={creditNote}
                onChange={(e) => setCreditNote(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreditAction}
              disabled={isProcessingCredit}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
            >
              {isProcessingCredit ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {creditAction === "add" ? "Add Credit" : "Deduct Credit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}