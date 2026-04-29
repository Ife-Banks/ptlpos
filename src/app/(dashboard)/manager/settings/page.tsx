"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Save,
  Loader2,
  Receipt,
  Store,
  Printer,
  Check,
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { tenantsApi } from "@/lib/api/tenants";
import type { ReceiptSettings } from "@/types/api";
import { cn } from "@/lib/utils";

export default function ManagerSettingsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [settings, setSettings] = useState<ReceiptSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [form, setForm] = useState({
    headerText: "",
    footerText: "",
    showLogo: true,
    showBranchName: true,
    showCashierName: true,
    showDate: true,
    showInvoiceNumber: true,
    paperSize: "THERMAL" as const,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await tenantsApi.getReceiptSettings();
      setSettings(data);
      setForm({
        headerText: data.headerText || "",
        footerText: data.footerText || "",
        showLogo: data.showLogo !== false,
        showBranchName: data.showBranchName !== false,
        showCashierName: data.showCashierName !== false,
        showDate: data.showDate !== false,
        showInvoiceNumber: data.showInvoiceNumber !== false,
        paperSize: (data.paperSize as "THERMAL") || "THERMAL",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await tenantsApi.updateReceiptSettings({
        headerText: form.headerText || undefined,
        footerText: form.footerText || undefined,
        showLogo: form.showLogo,
        showBranchName: form.showBranchName,
        showCashierName: form.showCashierName,
        showDate: form.showDate,
        showInvoiceNumber: form.showInvoiceNumber,
        paperSize: form.paperSize,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key: keyof typeof form) => {
    setForm({ ...form, [key]: !form[key] });
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage receipt and branch settings.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#003D9B]/10 dark:bg-[#0066FF]/20">
                <Receipt className="h-5 w-5 text-[#003D9B] dark:text-[#0066FF]" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Receipt Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Header Text</label>
                <Input
                  value={form.headerText}
                  onChange={(e) => setForm({ ...form, headerText: e.target.value })}
                  placeholder="Thank you for your purchase!"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Footer Text</label>
                <Input
                  value={form.footerText}
                  onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                  placeholder="Please come again!"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Paper Size</label>
                <select
                  value={form.paperSize}
                  onChange={(e) => setForm({ ...form, paperSize: e.target.value as any })}
                  className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                >
                  <option value="THERMAL">Thermal (58mm)</option>
                  <option value="A5">A5</option>
                  <option value="A4">A4</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Printer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Print Options</h2>
            </div>

            <div className="space-y-3">
              {[
                { key: "showLogo" as const, label: "Show Logo" },
                { key: "showBranchName" as const, label: "Branch Name" },
                { key: "showCashierName" as const, label: "Cashier Name" },
                { key: "showDate" as const, label: "Date & Time" },
                { key: "showInvoiceNumber" as const, label: "Invoice Number" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => toggleSetting(item.key)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                    form[item.key]
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  )}
                >
                  <span className="text-gray-900 dark:text-white">{item.label}</span>
                  <div
                    className={cn(
                      "w-5 h-5 rounded flex items-center justify-center",
                      form[item.key]
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    {form[item.key] && <Check className="h-3 w-3" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <Receipt className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Receipt Preview</h2>
            </div>

            <div className="bg-white border rounded-lg p-4 max-w-sm mx-auto font-mono text-sm">
              {form.showLogo && (
                <div className="text-center border-b pb-2 mb-2">
                  <p className="font-bold text-lg">YOUR STORE</p>
                </div>
              )}
              {form.showBranchName && (
                <p className="text-center mb-1">Branch Name</p>
              )}
              <div className="text-center border-b py-1 mb-2">
                {form.showInvoiceNumber && <p>Invoice: INV-00001</p>}
              </div>
              <div className="space-y-1 mb-2">
                <p>1x Product Name............$10.00</p>
                <p>2x Another Item........$25.00</p>
              </div>
              <div className="border-t py-1 flex justify-between">
                <span>Total</span>
                <span className="font-bold">$35.00</span>
              </div>
              {form.showDate && (
                <p className="text-center mt-2 text-gray-500">
                  {new Date().toLocaleString()}
                </p>
              )}
              {form.showCashierName && (
                <p className="text-center text-gray-500">Cashier: Staff Name</p>
              )}
              {(form.headerText || form.footerText) && (
                <div className="text-center mt-2 pt-2 border-t">
                  <p className="text-sm">{form.headerText}</p>
                  <p className="text-sm">{form.footerText}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}