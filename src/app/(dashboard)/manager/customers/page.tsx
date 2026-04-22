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
import { Plus, Search, MoreHorizontal, FileText, User, Mail, Phone, Users, DollarSign, Calendar, TrendingUp, UserPlus } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const mockCustomers = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1 234 567 8900", totalPurchases: 2345.5, orders: 12, createdAt: "Jan 15, 2024" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1 234 567 8901", totalPurchases: 1890.0, orders: 8, createdAt: "Feb 20, 2024" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", phone: "+1 234 567 8902", totalPurchases: 3456.75, orders: 15, createdAt: "Mar 10, 2024" },
  { id: "4", name: "Sarah Wilson", email: "sarah@example.com", phone: "+1 234 567 8903", totalPurchases: 890.25, orders: 5, createdAt: "Mar 25, 2024" },
  { id: "5", name: "Tom Brown", email: "tom@example.com", phone: "+1 234 567 8904", totalPurchases: 1234.0, orders: 7, createdAt: "Apr 05, 2024" },
  { id: "6", name: "Emily Davis", email: "emily@example.com", phone: "+1 234 567 8905", totalPurchases: 567.89, orders: 3, createdAt: "Apr 15, 2024" },
  { id: "7", name: "Chris Lee", email: "chris@example.com", phone: "+1 234 567 8906", totalPurchases: 2100.0, orders: 10, createdAt: "May 01, 2024" },
  { id: "8", name: "Amanda Garcia", email: "amanda@example.com", phone: "+1 234 567 8907", totalPurchases: 450.0, orders: 2, createdAt: "May 10, 2024" },
];

export default function CustomersPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      search === "" ||
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search)
  );

  const stats = {
    total: mockCustomers.length,
    totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalPurchases, 0),
    totalOrders: mockCustomers.reduce((sum, c) => sum + c.orders, 0),
    avgOrderValue: mockCustomers.reduce((sum, c) => sum + c.totalPurchases, 0) / mockCustomers.reduce((sum, c) => sum + c.orders, 0),
  };

  const getCustomerInitial = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage customer profiles and history</p>
        </div>
        <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Order Value</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${stats.avgOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "rounded-xl border",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      )}>
        <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "pl-9",
                isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
              )}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className={cn(isDark ? "bg-gray-800/50" : "bg-gray-50")}>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Customer</TableHead>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Email</TableHead>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Phone</TableHead>
                <TableHead className={cn("text-right", isDark ? "text-gray-400" : "text-gray-600")}>Orders</TableHead>
                <TableHead className={cn("text-right", isDark ? "text-gray-400" : "text-gray-600")}>Total Purchases</TableHead>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Joined</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow 
                  key={customer.id}
                  className={cn(
                    "transition-colors",
                    isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                        isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
                      )}>
                        {getCustomerInitial(customer.name)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {customer.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-gray-900 dark:text-white">{customer.orders}</TableCell>
                  <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                    ${customer.totalPurchases.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">{customer.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className={cn(isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
                        <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>View Purchase History</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}