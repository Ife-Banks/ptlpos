"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import { Search, Plus, Filter, MoreHorizontal, Package, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const mockInventory = [
  { id: "1", name: "Widget A", sku: "WGT-001", quantity: 125, threshold: 20, category: "Electronics", updatedAt: "Oct 15, 2024" },
  { id: "2", name: "Widget B", sku: "WGT-002", quantity: 8, threshold: 15, category: "Electronics", updatedAt: "Oct 15, 2024" },
  { id: "3", name: "Gadget X", sku: "GDG-012", quantity: 45, threshold: 10, category: "Electronics", updatedAt: "Oct 14, 2024" },
  { id: "4", name: "Component Y", sku: "CMP-034", quantity: 3, threshold: 20, category: "Parts", updatedAt: "Oct 14, 2024" },
  { id: "5", name: "Part Z", sku: "PRT-056", quantity: 200, threshold: 25, category: "Parts", updatedAt: "Oct 13, 2024" },
  { id: "6", name: "Assembly Kit", sku: "ASM-001", quantity: 0, threshold: 10, category: "Kits", updatedAt: "Oct 12, 2024" },
  { id: "7", name: "Power Supply", sku: "PWR-012", quantity: 78, threshold: 15, category: "Electronics", updatedAt: "Oct 15, 2024" },
  { id: "8", name: "Display Module", sku: "DSP-034", quantity: 12, threshold: 10, category: "Electronics", updatedAt: "Oct 14, 2024" },
];

const categories = ["All", "Electronics", "Parts", "Kits", "Accessories"];
const statusFilters = ["All", "In Stock", "Low Stock", "Out of Stock"];

export default function InventoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const, color: "text-red-600 dark:text-red-400" };
    if (quantity <= threshold) return { label: "Low Stock", variant: "warning" as const, color: "text-amber-600 dark:text-amber-400" };
    return { label: "In Stock", variant: "default" as const, color: "text-emerald-600 dark:text-emerald-400" };
  };

  const getStatusFilter = (quantity: number, threshold: number) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= threshold) return "Low Stock";
    return "In Stock";
  };

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch = search === "" || 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const itemStatus = getStatusFilter(item.quantity, item.threshold);
    const matchesStatus = selectedStatus === "All" || itemStatus === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: mockInventory.length,
    inStock: mockInventory.filter(i => i.quantity > i.threshold).length,
    lowStock: mockInventory.filter(i => i.quantity <= i.threshold && i.quantity > 0).length,
    outOfStock: mockInventory.filter(i => i.quantity === 0).length,
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage stock levels across branches</p>
        </div>
        <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90">
          <Plus className="mr-2 h-4 w-4" />
          Adjust Stock
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
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
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Stock</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.inStock}</p>
            </div>
          </div>
        </div>
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        <div className={cn(
          "rounded-xl border p-4 transition-all duration-200",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Out of Stock</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "rounded-xl border",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      )}>
        <div className={cn("p-4 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "pl-9",
                  isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                )}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                      selectedCategory === cat
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                      selectedStatus === status
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className={cn(isDark ? "bg-gray-800/50" : "bg-gray-50")}>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Product</TableHead>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>SKU</TableHead>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Category</TableHead>
                <TableHead className={cn("text-right", isDark ? "text-gray-400" : "text-gray-600")}>Quantity</TableHead>
                <TableHead className={cn("text-right", isDark ? "text-gray-400" : "text-gray-600")}>Threshold</TableHead>
                <TableHead className={cn(isDark ? "text-gray-400" : "text-gray-600")}>Status</TableHead>
                <TableHead className={cn("text-right", isDark ? "text-gray-400" : "text-gray-600")}>Last Updated</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const status = getStockStatus(item.quantity, item.threshold);
                return (
                  <TableRow 
                    key={item.id}
                    className={cn(
                      "transition-colors",
                      isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                    )}
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white">{item.name}</TableCell>
                    <TableCell className="font-mono text-gray-600 dark:text-gray-400">{item.sku}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{item.category}</TableCell>
                    <TableCell className="text-right font-medium text-gray-900 dark:text-white">{item.quantity}</TableCell>
                    <TableCell className="text-right text-gray-500 dark:text-gray-400">{item.threshold}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={status.variant}
                        className={cn(
                          status.variant === "default" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                          status.variant === "warning" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                          status.variant === "destructive" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-gray-500 dark:text-gray-400">{item.updatedAt}</TableCell>
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
                          <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>View Details</DropdownMenuItem>
                          <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>Adjust Stock</DropdownMenuItem>
                          <DropdownMenuItem className={cn(isDark ? "focus:bg-gray-700" : "")}>Transfer Stock</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}