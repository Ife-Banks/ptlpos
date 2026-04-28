"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Bell,
  CreditCard,
  Globe,
  Shield,
  Save,
  Plus,
  Edit,
  Receipt,
  Percent,
} from "lucide-react";
import { tenantsApi } from "@/lib/api/tenants";
import { branchesApi } from "@/lib/api/branches";
import { cn } from "@/lib/utils";
import type { Tenant, TaxConfig, ReceiptSettings } from "@/types/api";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Organization data
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("");
  
  // Tax config
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState(7.5);
  const [taxId, setTaxId] = useState("");
  
  // Receipt settings
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings>({
    showBusinessName: true,
    showPhone: true,
    showAddress: true,
    showUnitPrice: true,
    customHeader: "",
    customFooter: "",
    showCustomerName: true,
    showCustomerPhone: true,
  });

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [inventoryAlerts, setInventoryAlerts] = useState(true);
  const [timezone, setTimezone] = useState("America/New_York");
  const [currency, setCurrency] = useState("USD");
  
  // Branches for settings tab
  const [branchesList, setBranchesList] = useState<any[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  
  const loadBranchesForSettings = async () => {
    setBranchesLoading(true);
    try {
      const response = await branchesApi.list({ limit: 50 });
      setBranchesList(response.data || []);
    } catch (err) {
      console.error("Failed to load branches:", err);
    } finally {
      setBranchesLoading(false);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await tenantsApi.get();
        setTenant(data);
        setCompanyName(data.name || "");
        setCompanyEmail(data.email || "");
        setCompanyPhone(data.phone || "");
        setCompanyAddress(data.address || "");
        setCompanyWebsite(data.website || "");
        setCompanyIndustry(data.industry || "");
        
        if (data.taxConfig) {
          setTaxEnabled(!data.taxConfig.vatInclusive);
          setTaxRate(data.taxConfig.taxRate || 7.5);
          setTaxId(data.taxConfig.taxId || "");
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load branches when branches tab is active
    if (activeTab === "branches") {
      loadBranchesForSettings();
    }
    
    loadSettings();
  }, [activeTab]);

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    setErrorMsg("");
    try {
      await tenantsApi.update({
        name: companyName,
        email: companyEmail,
        phone: companyPhone,
        address: companyAddress,
        website: companyWebsite,
        industry: companyIndustry,
      });
      setSuccessMsg("Organization details saved");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg("Failed to save organization details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTax = async () => {
    setIsSaving(true);
    setErrorMsg("");
    try {
      await tenantsApi.updateTaxSettings({
        vatInclusive: !taxEnabled,
        taxRate: taxRate,
        taxId: taxId,
      });
      setSuccessMsg("Tax settings saved");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg("Failed to save tax settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveReceipt = async () => {
    setIsSaving(true);
    setErrorMsg("");
    try {
      await tenantsApi.updateReceiptSettings(receiptSettings);
      setSuccessMsg("Receipt settings saved");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg("Failed to save receipt settings");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "Organization", icon: Building2 },
    { id: "tax", label: "Tax", icon: Percent },
    { id: "receipt", label: "Receipts", icon: Receipt },
    { id: "branches", label: "Branches", icon: Globe },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your organization settings.</p>
        </div>
        <Button className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
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

      {/* Organization Tab */}
      {activeTab === "general" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Organization Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">View and update your business information.</p>
          </div>
          {(successMsg || errorMsg) && (
            <div className={cn("mx-6 mt-4 p-3 rounded-lg text-sm", successMsg ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
              {successMsg || errorMsg}
            </div>
          )}
          <div className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Business Name</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Phone</Label>
                <Input
                  type="tel"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Website</Label>
                <Input
                  type="url"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="https://yourbusiness.com"
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-gray-700 dark:text-gray-300">Address</Label>
                <Input
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Industry</Label>
                <Select value={companyIndustry} onValueChange={setCompanyIndustry}>
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveGeneral}
                disabled={isSaving}
                className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Tab */}
      {activeTab === "tax" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tax Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure tax rates for sales calculations.</p>
          </div>
          {(successMsg || errorMsg) && (
            <div className={cn("mx-6 mt-4 p-3 rounded-lg text-sm", successMsg ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
              {successMsg || errorMsg}
            </div>
          )}
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">Enable Tax Calculation</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Apply tax to all sales</p>
              </div>
              <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Tax Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  disabled={!taxEnabled}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Tax ID / VAT Number</Label>
                <Input
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="VAT123456789"
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveTax}
                disabled={isSaving}
                className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Tax Settings"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Tab */}
      {activeTab === "receipt" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Receipt Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize receipt appearance and content.</p>
          </div>
          {(successMsg || errorMsg) && (
            <div className={cn("mx-6 mt-4 p-3 rounded-lg text-sm", successMsg ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
              {successMsg || errorMsg}
            </div>
          )}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">Show Business Name</p>
                <Switch checked={receiptSettings.showBusinessName} onCheckedChange={(v) => setReceiptSettings(s => ({...s, showBusinessName: v}))} />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">Show Phone Number</p>
                <Switch checked={receiptSettings.showPhone} onCheckedChange={(v) => setReceiptSettings(s => ({...s, showPhone: v}))} />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">Show Address</p>
                <Switch checked={receiptSettings.showAddress} onCheckedChange={(v) => setReceiptSettings(s => ({...s, showAddress: v}))} />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">Show Unit Price</p>
                <Switch checked={receiptSettings.showUnitPrice} onCheckedChange={(v) => setReceiptSettings(s => ({...s, showUnitPrice: v}))} />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">Show Customer Name</p>
                <Switch checked={receiptSettings.showCustomerName} onCheckedChange={(v) => setReceiptSettings(s => ({...s, showCustomerName: v}))} />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">Show Customer Phone</p>
                <Switch checked={receiptSettings.showCustomerPhone} onCheckedChange={(v) => setReceiptSettings(s => ({...s, showCustomerPhone: v}))} />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Custom Header Text</Label>
                <Input
                  value={receiptSettings.customHeader || ""}
                  onChange={(e) => setReceiptSettings(s => ({...s, customHeader: e.target.value}))}
                  placeholder="Thank you for shopping!"
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Custom Footer Text</Label>
                <Input
                  value={receiptSettings.customFooter || ""}
                  onChange={(e) => setReceiptSettings(s => ({...s, customFooter: e.target.value}))}
                  placeholder="Please come again!"
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveReceipt}
                disabled={isSaving}
                className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Receipt Settings"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Branches Tab */}
      {activeTab === "branches" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Branch Management</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your organization branches and locations.</p>
          </div>
          <div className="p-6 space-y-4">
            {branchesLoading ? (
              <div className="text-center py-8 text-gray-500">Loading branches...</div>
            ) : branchesList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No branches found. Add your first branch.</div>
            ) : (
              branchesList.map((branch) => (
                <div key={branch.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{branch.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {[branch.address, branch.city, branch.state].filter(Boolean).join(", ") || "No address"}
                    </p>
                  </div>
                  {branch.isDefault ? (
                    <Badge className="bg-[#003D9B] dark:bg-[#0066FF] text-white">Default</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                  )}
                </div>
              ))
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = "/admin/branches"}
            >
              <Plus className="mr-2 h-4 w-4" />
              Manage Branches
            </Button>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure payment methods and options.</p>
          </div>
          <div className="p-6 space-y-6">
            {[
              { title: "Accept Cash Payments", desc: "Enable cash payment method at POS", checked: true },
              { title: "Accept Card Payments", desc: "Enable card payment method at POS", checked: true },
              { title: "Accept Mobile Payments", desc: "Enable mobile payment (Apple Pay, Google Pay)", checked: true },
              { title: "Enable Split Payments", desc: "Allow customers to split payments across methods", checked: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.checked} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure how you receive notifications.</p>
            </div>
            <div className="p-6 space-y-6">
              {[
                { title: "Email Notifications", desc: "Receive important updates via email", checked: emailNotifications, setChecked: setEmailNotifications },
                { title: "SMS Notifications", desc: "Receive critical alerts via SMS", checked: smsNotifications, setChecked: setSmsNotifications },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <Switch checked={item.checked} onCheckedChange={item.setChecked} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Alert Settings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure specific alerts you want to receive.</p>
            </div>
            <div className="p-6 space-y-6">
              {[
                { title: "Order Alerts", desc: "Get notified when new orders are placed", checked: orderAlerts, setChecked: setOrderAlerts },
                { title: "Low Inventory Alerts", desc: "Get notified when inventory is running low", checked: inventoryAlerts, setChecked: setInventoryAlerts },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <Switch checked={item.checked} onCheckedChange={item.setChecked} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage security and access control settings.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Require 2FA for all admin users</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">Session Timeout</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Automatically logout after inactivity</p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">Password Requirements</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enforce strong password policies</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}