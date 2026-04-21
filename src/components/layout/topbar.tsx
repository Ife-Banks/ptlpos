"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  "/inventory": "Inventory",
  "/orders": "Orders",
  "/purchases": "Purchases",
  "/customers": "Customers",
  "/products": "Products",
  "/pos": "POS Terminal",
};

export function Topbar() {
  const pathname = usePathname();
  const { toggleSidebar, isSidebarCollapsed } = useUIStore();
  const { user } = useAuthStore();
  
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentTitle = pageTitles[pathname] || pathSegments[pathSegments.length - 1] || "Dashboard";

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-14 border-b border-border-light bg-white transition-all duration-300",
        isSidebarCollapsed ? "left-16" : "left-60"
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <span key={index} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className={index === pathSegments.length - 1 ? "text-text-primary font-medium" : "text-muted-foreground capitalize"}>
                  {pageTitles[`/${pathSegments.slice(0, index + 1).join("/")}`] || segment}
                </span>
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search... (/)"
              className="w-64 pl-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium text-warning">Low Stock Alert</span>
                <span className="text-sm text-muted-foreground">5 products are running low</span>
                <span className="text-xs text-muted-foreground">2 minutes ago</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs text-white">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}