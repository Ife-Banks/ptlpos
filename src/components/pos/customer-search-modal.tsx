"use client";

import { useState, useEffect } from "react";
import { Search, User, Phone, Mail, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { customersApi } from "@/lib/api/customers";
import { cn, formatCurrency } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalSpent?: number;
  orderCount?: number;
}

interface CustomerSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: Customer) => void;
}

export function CustomerSearchModal({ open, onClose, onSelectCustomer }: CustomerSearchModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (open && searchQuery.length >= 2) {
      const searchCustomers = async () => {
        setLoading(true);
        try {
          const response = await customersApi.list({ search: searchQuery, limit: 20 });
          setCustomers(response.data || []);
        } catch (err) {
          console.error("Failed to search customers:", err);
        } finally {
          setLoading(false);
        }
      };
      
      const debounce = setTimeout(searchCustomers, 300);
      return () => clearTimeout(debounce);
    } else {
      setCustomers([]);
    }
  }, [searchQuery, open]);

  const handleCreateCustomer = async () => {
    if (!newCustomer.name.trim()) return;
    
    setCreating(true);
    try {
      const customer = await customersApi.create({
        name: newCustomer.name,
        phone: newCustomer.phone || undefined,
        email: newCustomer.email || undefined,
      });
      onSelectCustomer(customer);
      setNewCustomer({ name: "", phone: "", email: "" });
      setShowCreate(false);
    } catch (err) {
      console.error("Failed to create customer:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setCustomers([]);
    setShowCreate(false);
    setNewCustomer({ name: "", phone: "", email: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn("max-w-4xl", isDark ? "bg-gray-900" : "bg-white")}>
        <DialogHeader>
          <DialogTitle className={isDark ? "text-white" : "text-gray-900"}>
            {showCreate ? "Add New Customer" : "Find Customer"}
          </DialogTitle>
        </DialogHeader>

        {!showCreate ? (
          <>
            {/* Search Input */}
            <div className="relative">
              <Search className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                isDark ? "text-gray-500" : "text-gray-400"
              )} />
              <Input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-10 h-11",
                  isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
                )}
                autoFocus
              />
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#003D9B]" />
                </div>
              ) : customers.length > 0 ? (
                <div className="space-y-2">
                  {customers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => onSelectCustomer(customer)}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-colors",
                        isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          isDark ? "bg-gray-800" : "bg-gray-100"
                        )}>
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-medium truncate",
                            isDark ? "text-white" : "text-gray-900"
                          )}>
                            {customer.name}
                          </p>
                          <div className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>
                            {customer.phone && <span>{customer.phone}</span>}
                            {customer.phone && customer.email && <span> • </span>}
                            {customer.email && <span>{customer.email}</span>}
                          </div>
                        </div>
                        {customer.totalSpent !== undefined && (
                          <div className="text-right">
                            <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>
                              {formatCurrency(customer.totalSpent)}
                            </p>
                            <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>
                              {customer.orderCount} orders
                            </p>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="text-center py-8">
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    No customers found
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    Enter at least 2 characters to search
                  </p>
                </div>
              )}
            </div>

            {/* Create New Button */}
            <Button
              variant="outline"
              onClick={() => setShowCreate(true)}
              className={cn(
                "w-full",
                isDark ? "border-gray-700 hover:bg-gray-800" : ""
              )}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Customer
            </Button>
          </>
        ) : (
          <>
            {/* Create Form */}
            <div className="space-y-4">
              <div>
                <label className={cn(
                  "text-sm font-medium mb-1 block",
                  isDark ? "text-gray-300" : "text-gray-700"
                )}>
                  Name *
                </label>
                <Input
                  type="text"
                  placeholder="Customer name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}
                />
              </div>
              <div>
                <label className={cn(
                  "text-sm font-medium mb-1 block",
                  isDark ? "text-gray-300" : "text-gray-700"
                )}>
                  Phone
                </label>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}
                />
              </div>
              <div>
                <label className={cn(
                  "text-sm font-medium mb-1 block",
                  isDark ? "text-gray-300" : "text-gray-700"
                )}>
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreate(false)}
                className={cn("flex-1", isDark ? "border-gray-700" : "")}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCustomer}
                disabled={!newCustomer.name.trim() || creating}
                className="flex-1 bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] text-white"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Create
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}