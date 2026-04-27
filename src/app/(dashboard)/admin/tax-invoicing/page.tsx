"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  DollarSign,
  Receipt,
  Calculator,
  Plus,
  Edit,
  Download,
  CreditCard,
  Loader2,
} from "lucide-react";
import { invoicesApi } from "@/lib/api/invoices";
import type { Invoice } from "@/lib/api/invoices";

const taxRates = [
  { id: "1", name: "VAT", rate: 7.5, type: "percentage", status: "active" },
  { id: "2", name: "Service Charge", rate: 5, type: "percentage", status: "active" },
  { id: "3", name: "Excise Duty", rate: 10, type: "percentage", status: "inactive" },
];

const quotationTemplates = [
  { id: "1", name: "Standard Quote", description: "Default quotation template" },
  { id: "2", name: "Detailed Quote", description: "Detailed quote with line items" },
  { id: "3", name: "Quick Quote", description: "Simplified quotation" },
];

export default function AdminTaxInvoicingPage() {
  const [activeTab, setActiveTab] = useState("taxes");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [enableTax, setEnableTax] = useState(true);
  const [enableDiscounts, setEnableDiscounts] = useState(true);

  useEffect(() => {
    if (activeTab === "invoices") {
      loadInvoices();
    }
  }, [activeTab]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const response = await invoicesApi.list();
      setInvoices(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "taxes", label: "Taxes", icon: Calculator },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "templates", label: "Templates", icon: FileText },
    { id: "settings", label: "Settings", icon: CreditCard },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Tax & Invoicing</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage taxes, discounts, and invoicing.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {tabs.map((tab) => (
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

      {/* Taxes Tab */}
      {activeTab === "taxes" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tax Rates</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure tax rates for your products and services.</p>
            </div>
            <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Tax Rate
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {taxRates.map((tax) => (
                  <tr key={tax.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{tax.name}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{tax.rate}{tax.type === "percentage" ? "%" : ""}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 capitalize">{tax.type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(tax.status)}`}>
                        {tax.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Invoices</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">View and manage customer invoices.</p>
            </div>
            <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white">
              <FileText className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Invoice ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#003D9B]" />
                    </td>
                  </tr>
                ) : !Array.isArray(invoices) || invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{invoice.customer?.name || "-"}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">${invoice.amount?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quotation Templates</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage quotation and invoice templates.</p>
          </div>
          <div className="p-6 space-y-4">
            {quotationTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{template.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure general tax and invoicing settings.</p>
          </div>
          <div className="p-6 space-y-6">
            {[
              { title: "Enable Tax Calculation", desc: "Automatically calculate taxes on orders", checked: enableTax, setChecked: setEnableTax },
              { title: "Enable Discounts", desc: "Allow discounts on orders and invoices", checked: enableDiscounts, setChecked: setEnableDiscounts },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <Switch checked={item.checked} onCheckedChange={item.setChecked} />
              </div>
            ))}
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Default Tax Rate</Label>
              <Select defaultValue="1">
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue placeholder="Select default tax rate" />
                </SelectTrigger>
                <SelectContent>
                  {taxRates.map((tax) => (
                    <SelectItem key={tax.id} value={tax.id}>
                      {tax.name} ({tax.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Invoice Prefix</Label>
                <Input defaultValue="INV-" className="dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Payment Terms (Days)</Label>
                <Input defaultValue="30" type="number" className="dark:bg-gray-800 dark:border-gray-700" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}