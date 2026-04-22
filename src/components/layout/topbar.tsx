"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useUIStore, useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/providers/theme-toggle";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "User Management",
  "/admin/analytics": "Analytics & Reports",
  "/admin/import-export": "Import / Export",
  "/admin/tax-invoicing": "Tax & Invoicing",
  "/admin/production": "Production Management",
  "/admin/settings": "Settings",
  "/admin/audit": "Audit Logs",
  "/manager/dashboard": "Dashboard",
  "/manager/inventory": "Inventory",
  "/manager/orders": "Orders",
  "/manager/purchases": "Purchases",
  "/manager/customers": "Customers",
  "/sales/dashboard": "Dashboard",
  "/pos-terminal": "POS Terminal",
  "/profile": "Profile",
  "/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar, isSidebarCollapsed } = useUIStore();
  const { user, logout } = useAuthStore();
  
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentTitle = pageTitles[pathname] || pathSegments[pathSegments.length - 1] || "Dashboard";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-14 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",
        isSidebarCollapsed ? "left-16" : "left-60"
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <nav className="flex items-center gap-1 text-sm">
            <Link 
              href="/" 
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-1"
            >
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <span key={index} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className={cn(
                  "transition-colors capitalize",
                  index === pathSegments.length - 1 
                    ? "text-gray-900 dark:text-white font-medium" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}>
                  {pageTitles[`/${pathSegments.slice(0, index + 1).join("/")}`] || segment.replace(/-/g, " ")}
                </span>
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search... (Ctrl+K)"
              className="w-64 pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#003D9B] dark:focus:border-[#0066FF] outline-none"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="relative bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700"
              >
                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-medium">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
                <span className="font-semibold text-gray-900 dark:text-white">Notifications</span>
                <Button variant="link" size="sm" className="text-[#003D9B] dark:text-[#0066FF] h-auto p-0 text-xs">Mark all read</Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <span className="font-medium text-amber-600">Low Stock Alert</span>
                <span className="text-sm text-gray-500">5 products are running low</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <span className="font-medium text-[#003D9B]">New Order Received</span>
                <span className="text-sm text-gray-500">Order #12345 has been placed</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <span className="font-medium text-emerald-600">Payment Successful</span>
                <span className="text-sm text-gray-500">Invoice #INV-2024-001 paid</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
              <DropdownMenuItem className="justify-center text-[#003D9B] dark:text-[#0066FF] cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700"
              >
                <div className="h-7 w-7 rounded-full bg-[#003D9B] dark:bg-[#0066FF] flex items-center justify-center text-white text-xs font-semibold">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline text-gray-700 dark:text-gray-200">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
              <DropdownMenuItem>
                <Link href="/profile" className="flex w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="flex w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}