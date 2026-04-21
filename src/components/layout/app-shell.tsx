"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isSidebarCollapsed } = useUIStore();
  
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      
      <div className={cn(
        "transition-all duration-300",
        isSidebarCollapsed ? "ml-16" : "ml-60"
      )}>
        <Topbar />
        
        <main className="pt-14 min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}