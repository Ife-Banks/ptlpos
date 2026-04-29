"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore, useUIStore } from "@/stores";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Warehouse, 
  FileText,
  Settings,
  BarChart3,
  Factory,
  ClipboardList,
  DollarSign,
  PackagePlus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Receipt,
  Building2,
  Tags,
  Truck,
  ArrowLeftRight,
  RotateCcw,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sales", label: "Sales", icon: Receipt },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/branches", label: "Branches", icon: Building2 },
  { href: "/admin/shifts", label: "Shifts", icon: Clock },
  { href: "/admin/suppliers", label: "Suppliers", icon: Truck },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/inventory/transfers", label: "Transfers", icon: ArrowLeftRight },
  { href: "/admin/inventory/stocktake", label: "Stocktake", icon: RotateCcw },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/import-export", label: "Import/Export", icon: FileText },
  { href: "/admin/tax-invoicing", label: "Tax & Invoicing", icon: DollarSign },
  { href: "/admin/production", label: "Production", icon: Factory },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/audit", label: "Audit Logs", icon: Receipt },
];

const superAdminNavItems = [
  { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/super-admin/tenants", label: "Tenants", icon: Building2 },
  { href: "/super-admin/subscriptions", label: "Subscriptions", icon: DollarSign },
  { href: "/super-admin/plans", label: "Plans", icon: Package },
  { href: "/super-admin/tickets", label: "Tickets", icon: ClipboardList },
  { href: "/super-admin/analytics", label: "Analytics", icon: BarChart3 },
];

const managerNavItems = [
  { href: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/manager/sales", label: "Sales", icon: Receipt },
  { href: "/manager/inventory", label: "Inventory", icon: Warehouse },
  { href: "/manager/inventory/transfers", label: "Transfers", icon: ArrowLeftRight },
  { href: "/manager/inventory/stocktake", label: "Stocktake", icon: RotateCcw },
  { href: "/manager/orders", label: "Orders", icon: ClipboardList },
  { href: "/manager/purchases", label: "Purchases", icon: PackagePlus },
  { href: "/manager/suppliers", label: "Suppliers", icon: Truck },
  { href: "/manager/customers", label: "Customers", icon: Users },
];

const salesNavItems = [
  { href: "/sales/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pos-terminal", label: "POS Terminal", icon: ShoppingCart },
  { href: "/sales/sales", label: "Sales", icon: Receipt },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  
  const role = user?.role;
  let navItems: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [];
  
  switch (role) {
    case "ADMIN":
    case "BILLING_ADMIN":
      navItems = adminNavItems;
      break;
    case "SUPER_ADMIN":
      navItems = superAdminNavItems;
      break;
    case "MANAGER":
    case "SUPPORT_ADMIN":
      navItems = managerNavItems;
      break;
    case "SALES_REP":
      navItems = salesNavItems;
      break;
    default:
      navItems = [];
  }

  const getInitial = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1 
      ? parts[0][0] + parts[1][0] 
      : parts[0].slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col",
        isSidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between px-3 border-b border-gray-200 dark:border-gray-800">
        {!isSidebarCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#003D9B] dark:bg-[#0066FF] rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#003D9B] dark:text-[#0066FF]">PTLPOS</span>
          </Link>
        )}
        {isSidebarCollapsed && (
          <Link href="/" className="flex items-center justify-center mx-auto">
            <div className="w-8 h-8 bg-[#003D9B] dark:bg-[#0066FF] rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {/* New Sale Button - Always Visible */}
        <Link
          href="/pos-terminal"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200",
            "bg-[#003D9B] hover:bg-[#003D9B]/90 text-white dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90",
            "shadow-md hover:shadow-lg",
            isSidebarCollapsed && "justify-center px-2"
          )}
          title={isSidebarCollapsed ? "New Sale" : undefined}
        >
          <ShoppingCart className="h-5 w-5 shrink-0" />
          {!isSidebarCollapsed && <span>New Sale</span>}
        </Link>

        {/* Divider */}
        {!isSidebarCollapsed && (
          <div className="py-2">
            <span className="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">Menu</span>
          </div>
        )}

        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out relative",
                active
                  ? "bg-[#003D9B]/10 text-[#003D9B] dark:bg-[#0066FF]/10 dark:text-[#0066FF]"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                isSidebarCollapsed && "justify-center px-2"
              )}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#003D9B] dark:bg-[#0066FF] rounded-r-full" />
              )}
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-all duration-200",
                active ? "text-[#003D9B] dark:text-[#0066FF]" : "group-hover:translate-x-0.5"
              )} />
              {!isSidebarCollapsed && (
                <span className={cn(
                  "truncate transition-all duration-200",
                )}>{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-2">
        <div className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
          isSidebarCollapsed && "justify-center px-2"
        )}>
          <div className="h-9 w-9 rounded-full bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center text-[#003D9B] dark:text-[#0066FF] text-sm font-semibold shrink-0">
            {getInitial(user?.name)}
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}