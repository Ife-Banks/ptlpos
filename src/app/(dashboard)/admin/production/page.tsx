"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Factory,
  Package,
  Play,
  Pause,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Wrench,
  FileText,
  Plus,
} from "lucide-react";

const productionOrders = [
  { id: "PO-001", product: "Widget A", quantity: 500, status: "in_progress", progress: 75, startDate: "Oct 01", expectedDate: "Oct 15" },
  { id: "PO-002", product: "Widget B", quantity: 1000, status: "pending", progress: 0, startDate: "Oct 10", expectedDate: "Oct 25" },
  { id: "PO-003", product: "Gadget X", quantity: 250, status: "completed", progress: 100, startDate: "Sep 15", expectedDate: "Sep 30" },
  { id: "PO-004", product: "Component Y", quantity: 750, status: "on_hold", progress: 45, startDate: "Oct 05", expectedDate: "Oct 20" },
];

const materials = [
  { id: "1", name: "Steel Sheets", stock: 500, unit: "sheets", reorderLevel: 100 },
  { id: "2", name: "Aluminum Rods", stock: 250, unit: "rods", reorderLevel: 50 },
  { id: "3", name: "Copper Wire", stock: 100, unit: "kg", reorderLevel: 20 },
  { id: "4", name: "Plastic Pellets", stock: 1000, unit: "kg", reorderLevel: 200 },
  { id: "5", name: "Circuit Boards", stock: 45, unit: "pcs", reorderLevel: 10 },
];

const machines = [
  { id: "1", name: "Lathe Machine A", status: "operational", uptime: "98.5%", lastMaintenance: "Oct 01" },
  { id: "2", name: "CNC Machine B", status: "operational", uptime: "96.2%", lastMaintenance: "Sep 28" },
  { id: "3", name: "Press Machine C", status: "maintenance", uptime: "92.0%", lastMaintenance: "Oct 10" },
  { id: "4", name: "Assembly Line D", status: "operational", uptime: "99.1%", lastMaintenance: "Oct 05" },
];

export default function AdminProductionPage() {
  const [activeTab, setActiveTab] = useState("orders");

  const stats = [
    { label: "Active Orders", value: "12", sub: "In progress", icon: Factory, color: "blue" },
    { label: "Completed", value: "45", sub: "+23% from last month", icon: CheckCircle, color: "green" },
    { label: "On Hold", value: "3", sub: "Requires attention", icon: Pause, color: "amber" },
    { label: "Efficiency", value: "87%", sub: "+5% from last month", icon: TrendingUp, color: "emerald" },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      on_hold: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      operational: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Production</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage production orders and resources.</p>
        </div>
        <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white">
          <Package className="mr-2 h-4 w-4" />
          New Production Order
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
                stat.color === 'amber' ? 'text-amber-500' :
                'text-emerald-500'
              }`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {[
          { id: "orders", label: "Production Orders", icon: FileText },
          { id: "materials", label: "Materials", icon: Package },
          { id: "machines", label: "Machines", icon: Wrench },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-900 text-[#003D9B] dark:text-[#0066FF] shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Production Orders Tab */}
      {activeTab === "orders" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Production Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Start</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Expected</th>
                </tr>
              </thead>
              <tbody>
                {productionOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{order.product}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{order.quantity}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#003D9B] dark:bg-[#0066FF] rounded-full" style={{ width: `${order.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{order.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{order.startDate}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{order.expectedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === "materials" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Materials Inventory</h2>
            <Button variant="outline" size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Add Material
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Material</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Unit</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Reorder Level</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{material.name}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{material.stock}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{material.unit}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{material.reorderLevel}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        material.stock < material.reorderLevel
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}>
                        {material.stock < material.reorderLevel ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Machines Tab */}
      {activeTab === "machines" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Machine Status</h2>
            <Button variant="outline" size="sm">
              <Wrench className="h-3 w-3 mr-1" />
              Schedule Maintenance
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Machine</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Last Maintenance</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((machine) => (
                  <tr key={machine.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{machine.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(machine.status)}`}>
                        {machine.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{machine.uptime}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{machine.lastMaintenance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}