"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  CloudUpload,
} from "lucide-react";

const importHistory = [
  { id: "1", file: "products_2024.csv", type: "Products", records: 1234, status: "completed", date: "Oct 15, 2024" },
  { id: "2", file: "users_update.csv", type: "Users", records: 456, status: "completed", date: "Oct 14, 2024" },
  { id: "3", file: "inventory.csv", type: "Inventory", records: 5678, status: "failed", date: "Oct 13, 2024" },
  { id: "4", file: "prices_2024.csv", type: "Prices", records: 890, status: "completed", date: "Oct 12, 2024" },
];

const exportHistory = [
  { id: "1", file: "orders_oct_2024.csv", type: "Orders", records: 1234, date: "Oct 15, 2024" },
  { id: "2", file: "customers.csv", type: "Customers", records: 2345, date: "Oct 14, 2024" },
  { id: "3", file: "products_full.csv", type: "Products", records: 5678, date: "Oct 12, 2024" },
  { id: "4", file: "inventory_q4.csv", type: "Inventory", records: 3456, date: "Oct 10, 2024" },
];

const dataTypes = [
  { value: "products", label: "Products", description: "Product catalog", icon: Package },
  { value: "customers", label: "Customers", description: "Customer data", icon: Users },
  { value: "orders", label: "Orders", description: "Order history", icon: ShoppingCart },
  { value: "inventory", label: "Inventory", description: "Stock levels", icon: FileText },
  { value: "prices", label: "Prices", description: "Price lists", icon: DollarSign },
];

export default function AdminImportExportPage() {
  const [activeTab, setActiveTab] = useState("import");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Import / Export</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Import and export your data in CSV or Excel format.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {[
          { id: "import", label: "Import", icon: CloudUpload },
          { id: "export", label: "Export", icon: Download },
          { id: "history", label: "History", icon: Clock },
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

      {/* Import Tab */}
      {activeTab === "import" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Import Data</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload a CSV or Excel file to import data.</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Data Type Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select data type to import</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {dataTypes.map((type) => (
                  <button
                    key={type.value}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#003D9B] dark:hover:border-[#0066FF] hover:bg-[#003D9B]/5 dark:hover:bg-[#0066FF]/10 transition-all"
                  >
                    <type.icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{type.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive 
                  ? "border-[#003D9B] dark:border-[#0066FF] bg-[#003D9B]/5 dark:bg-[#0066FF]/10" 
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrag}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-[#003D9B] dark:text-[#0066FF]" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  or click to browse
                </p>
                <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white">
                  Choose File
                </Button>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                  Supports CSV and Excel files (max 10MB)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Tab */}
      {activeTab === "export" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select data type and export to CSV or Excel.</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Data Type Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select data type to export</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {dataTypes.map((type) => (
                  <button
                    key={type.value}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#003D9B] dark:hover:border-[#0066FF] hover:bg-[#003D9B]/5 dark:hover:bg-[#0066FF]/10 transition-all"
                  >
                    <type.icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{type.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Format */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 dark:text-white font-medium mb-1">Select data type above to export</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Export data in CSV or Excel format</p>
              <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="grid gap-6">
          {/* Import History */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Import History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">File</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Records</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {importHistory.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                          <span className="font-medium text-gray-900 dark:text-white">{item.file}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.type}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.records.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {item.status === "completed" ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Completed</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Failed</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export History */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">File</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Records</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {exportHistory.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-gray-900 dark:text-white">{item.file}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.type}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.records.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}