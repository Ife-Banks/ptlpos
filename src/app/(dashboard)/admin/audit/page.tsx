"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  Eye,
  MoreHorizontal,
  FileText,
  User,
  Settings,
  ShoppingCart,
  Package,
  LogIn,
  LogOut,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

const auditLogs = [
  { id: "1", action: "USER_LOGIN", user: "John Doe", email: "john@example.com", description: "User logged in successfully", ip: "192.168.1.100", timestamp: "Oct 15, 10:30 AM" },
  { id: "2", action: "CREATE_ORDER", user: "Jane Smith", email: "jane@example.com", description: "Created new order #ORD-1234", ip: "192.168.1.101", timestamp: "Oct 15, 10:25 AM" },
  { id: "3", action: "UPDATE_PRODUCT", user: "Mike Johnson", email: "mike@example.com", description: "Updated product Widget A", ip: "192.168.1.102", timestamp: "Oct 15, 10:20 AM" },
  { id: "4", action: "DELETE_USER", user: "Sarah Wilson", email: "sarah@example.com", description: "Deleted user account tom@example.com", ip: "192.168.1.103", timestamp: "Oct 15, 10:15 AM" },
  { id: "5", action: "UPDATE_SETTINGS", user: "John Doe", email: "john@example.com", description: "Updated payment settings", ip: "192.168.1.100", timestamp: "Oct 15, 10:10 AM" },
  { id: "6", action: "CREATE_INVENTORY", user: "Emily Davis", email: "emily@example.com", description: "Added new inventory item", ip: "192.168.1.104", timestamp: "Oct 15, 10:05 AM" },
  { id: "7", action: "USER_LOGOUT", user: "Tom Brown", email: "tom@example.com", description: "User logged out", ip: "192.168.1.105", timestamp: "Oct 15, 09:55 AM" },
  { id: "8", action: "EXPORT_DATA", user: "Chris Lee", email: "chris@example.com", description: "Exported customer data", ip: "192.168.1.106", timestamp: "Oct 15, 09:50 AM" },
];

const stats = [
  { label: "Total Events", value: "12,456", sub: "This month", icon: FileText, color: "blue" },
  { label: "User Activities", value: "8,234", sub: "This month", icon: User, color: "green" },
  { label: "System Changes", value: "2,345", sub: "This month", icon: Settings, color: "purple" },
  { label: "Data Exports", value: "1,877", sub: "This month", icon: Download, color: "amber" },
];

const actionTypes = [
  "USER_LOGIN", "USER_LOGOUT", "CREATE_ORDER", "UPDATE_ORDER", "DELETE_ORDER",
  "CREATE_PRODUCT", "UPDATE_PRODUCT", "DELETE_PRODUCT", "CREATE_USER", "UPDATE_USER",
  "DELETE_USER", "UPDATE_SETTINGS", "EXPORT_DATA", "IMPORT_DATA",
];

export default function AdminAuditPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = searchQuery === "" ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = !selectedAction || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const getActionIcon = (action: string) => {
    if (action.includes("LOGIN")) return LogIn;
    if (action.includes("LOGOUT")) return LogOut;
    if (action.includes("ORDER")) return ShoppingCart;
    if (action.includes("PRODUCT")) return Package;
    if (action.includes("USER")) return User;
    if (action.includes("SETTINGS")) return Settings;
    if (action.includes("EXPORT") || action.includes("IMPORT")) return FileText;
    return FileText;
  };

  const getActionColor = (action: string) => {
    if (action.includes("CREATE") || action.includes("LOGIN")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (action.includes("UPDATE")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (action.includes("DELETE")) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (action.includes("LOGOUT")) return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track all system activities and changes.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${
                stat.color === 'blue' ? 'text-blue-500' :
                stat.color === 'green' ? 'text-emerald-500' :
                stat.color === 'purple' ? 'text-purple-500' :
                'text-amber-500'
              }`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Plus className={`h-4 w-4 mr-2 transition-transform ${showFilters ? "rotate-45" : ""}`} />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedAction === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAction(null)}
                className={selectedAction === null ? "bg-[#003D9B] dark:bg-[#0066FF]" : ""}
              >
                All
              </Button>
              {actionTypes.map((action) => (
                <Button
                  key={action}
                  variant={selectedAction === action ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAction(action)}
                  className={selectedAction === action ? "bg-[#003D9B] dark:bg-[#0066FF]" : ""}
                >
                  {action.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">IP Address</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                return (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <ActionIcon className="h-4 w-4 text-gray-400" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{log.user}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{log.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 max-w-[250px] truncate">{log.description}</td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-500 dark:text-gray-400">{log.ip}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{log.timestamp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}