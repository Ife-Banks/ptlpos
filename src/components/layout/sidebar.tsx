"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/import-export", label: "Import/Export", icon: FileText },
  { href: "/admin/tax-invoicing", label: "Tax & Invoicing", icon: DollarSign },
  { href: "/admin/production", label: "Production", icon: Factory },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const managerNavItems = [
  { href: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Warehouse },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/purchases", label: "Purchases", icon: PackagePlus },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/products", label: "Products", icon: Package },
];

const salesNavItems = [
  { href: "/pos", label: "POS Terminal", icon: ShoppingCart },
  { href: "/customers", label: "Customers", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  
  const role = user?.role;
  let navItems: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [];
  
  switch (role) {
    case "ADMIN":
      navItems = adminNavItems;
      break;
    case "MANAGER":
      navItems = managerNavItems;
      break;
    case "SALES_REP":
      navItems = salesNavItems;
      break;
    default:
      navItems = [];
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300",
        isSidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-gray-800 px-4">
        {!isSidebarCollapsed && (
          <span className="text-lg font-bold text-primary-light">PTLPOS</span>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                isSidebarCollapsed && "justify-center"
              )}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 p-2">
        <div className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2",
          isSidebarCollapsed && "justify-center"
        )}>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-medium">
            {user?.name?.charAt(0) || "U"}
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-gray-400">{user?.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-gray-400 hover:text-white"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}