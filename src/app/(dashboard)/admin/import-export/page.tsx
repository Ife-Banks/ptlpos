"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  Package,
  Users,
  CloudUpload,
  Loader2,
  History,
} from "lucide-react";
import { exportsApi, importsApi } from "@/lib/api/analytics";

const dataTypes = [
  { value: "products", label: "Products", description: "Product catalog", icon: Package },
  { value: "customers", label: "Customers", description: "Customer data", icon: Users },
  { value: "suppliers", label: "Suppliers", description: "Supplier data", icon: FileText },
  { value: "inventory", label: "Inventory", description: "Stock levels", icon: FileSpreadsheet },
];

const exportDataTypes = [
  { value: "products", label: "Products", description: "Export products data", icon: Package },
  { value: "customers", label: "Customers", description: "Export customers data", icon: Users },
  { value: "suppliers", label: "Suppliers", description: "Export suppliers data", icon: FileText },
  { value: "inventory", label: "Inventory", description: "Export inventory data", icon: FileSpreadsheet },
];

export default function AdminImportExportPage() {
  const [activeTab, setActiveTab] = useState("import");
  const [dragActive, setDragActive] = useState(false);
  const [selectedImportType, setSelectedImportType] = useState<string | null>(null);
  const [selectedExportType, setSelectedExportType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; failed: number; errors: string[] } | null>(null);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && (selectedFile.name.endsWith(".csv") || selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".xls"))) {
      setFile(selectedFile);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!file || !selectedImportType) return;
    setUploading(true);
    setImportResult(null);
    try {
      let result;
      if (selectedImportType === "products") {
        result = await importsApi.products(file);
      } else if (selectedImportType === "customers") {
        result = await importsApi.customers(file);
      } else if (selectedImportType === "suppliers") {
        result = await importsApi.suppliers(file);
      }
      setImportResult(result || null);
    } catch (err) {
      console.error(err);
      setImportResult({ imported: 0, failed: 0, errors: ["Import failed"] });
    } finally {
      setUploading(false);
    }
  };

  const handleExport = async () => {
    if (!selectedExportType) return;
    setExporting(true);
    try {
      let blob;
      if (selectedExportType === "products") {
        blob = await exportsApi.products();
      } else if (selectedExportType === "customers") {
        blob = await exportsApi.customers();
      } else if (selectedExportType === "suppliers") {
        blob = await exportsApi.suppliers();
      } else if (selectedExportType === "inventory") {
        blob = await exportsApi.inventory();
      }
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedExportType}_export.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
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
                    onClick={() => setSelectedImportType(type.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      selectedImportType === type.value
                        ? "border-[#003D9B] dark:border-[#0066FF] bg-[#003D9B]/5 dark:bg-[#0066FF]/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-[#003D9B] dark:hover:border-[#0066FF]"
                    }`}
                  >
                    <type.icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</span>
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
              onDrop={(e) => {
                handleDrag(e);
                const files = e.dataTransfer.files;
                if (files.length > 0) handleFileSelect(files[0]);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) handleFileSelect(files[0]);
                }}
              />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-[#003D9B] dark:text-[#0066FF]" />
                </div>
                {file ? (
                  <>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{(file.size / 1024).toFixed(1)} KB</p>
                    <Button
                      onClick={handleImport}
                      disabled={uploading || !selectedImportType}
                      className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
                    >
                      {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {uploading ? "Importing..." : "Import Data"}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      or click to browse
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
                    >
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                      Supports CSV and Excel files (max 10MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Import Result */}
            {importResult && (
              <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                <p className="font-medium text-emerald-700 dark:text-emerald-400">
                  Imported: {importResult.imported} records
                  {importResult.failed > 0 && ` | Failed: ${importResult.failed}`}
                </p>
                {importResult.errors.length > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{importResult.errors[0]}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "export" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select data type and export to CSV or Excel.</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select data type to export</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {exportDataTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedExportType(type.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      selectedExportType === type.value
                        ? "border-[#003D9B] dark:border-[#0066FF] bg-[#003D9B]/5 dark:bg-[#0066FF]/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-[#003D9B] dark:hover:border-[#0066FF] hover:bg-[#003D9B]/5 dark:hover:bg-[#0066FF]/10"
                    }`}
                  >
                    <type.icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 dark:text-white font-medium mb-1">
                {selectedExportType ? `Export ${selectedExportType.charAt(0).toUpperCase() + selectedExportType.slice(1)}` : "Select data type above to export"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Export data in CSV format</p>
              <Button
                onClick={handleExport}
                disabled={!selectedExportType || exporting}
                className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
              >
                {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {exporting ? "Exporting..." : "Export Data"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}