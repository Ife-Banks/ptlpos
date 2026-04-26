"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Plus, Loader2, AlertCircle, DollarSign, Users, Building2, Package, X } from "lucide-react";
import { adminApi, type SubscriptionPlan } from "@/lib/api/admin";

export default function SuperAdminPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    price: 0,
    billingCycle: "MONTHLY" as "MONTHLY" | "YEARLY",
    limits: { users: 10, branches: 5, products: 1000 },
    features: [] as string[],
    isActive: true,
  });
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.listPlans();
      setPlans(data);
    } catch (err) {
      setError("Failed to load plans");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    setSaving(true);
    try {
      await adminApi.createPlan(newPlan);
      setShowModal(false);
      setNewPlan({
        name: "",
        description: "",
        price: 0,
        billingCycle: "MONTHLY",
        limits: { users: 10, branches: 5, products: 1000 },
        features: [],
        isActive: true,
      });
      loadPlans();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case "inventory": return <Package className="h-4 w-4" />;
      case "reports": return <Users className="h-4 w-4" />;
      case "multi_branch": return <Building2 className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Subscription Plans</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage pricing plans.</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12 text-red-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      )}

      {/* Plans Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                </div>
                <Badge className={plan.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-600"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">/{plan.billingCycle.toLowerCase()}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{plan.limits.users || "Unlimited"} users</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Building2 className="h-4 w-4" />
                  <span>{plan.limits.branches || "Unlimited"} branches</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Package className="h-4 w-4" />
                  <span>{plan.limits.products || "Unlimited"} products</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {plan.features.map((feature, i) => (
                  <Badge key={i} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                    {getFeatureIcon(feature)}
                    <span className="ml-1 capitalize">{feature.replace("_", " ")}</span>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                <Button variant="outline" size="sm" className="flex-1 text-red-600">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Subscription Plan</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">Plan Name</label>
                <Input
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="e.g., Pro Plan"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <Input
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  placeholder="e.g., Advanced features for growing businesses"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Price</label>
                  <Input
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Billing Cycle</label>
                  <select
                    value={newPlan.billingCycle}
                    onChange={(e) => setNewPlan({ ...newPlan, billingCycle: e.target.value as "MONTHLY" | "YEARLY" })}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">User Limit</label>
                  <Input
                    type="number"
                    value={newPlan.limits.users}
                    onChange={(e) => setNewPlan({ ...newPlan, limits: { ...newPlan.limits, users: Number(e.target.value) } })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Branch Limit</label>
                  <Input
                    type="number"
                    value={newPlan.limits.branches}
                    onChange={(e) => setNewPlan({ ...newPlan, limits: { ...newPlan.limits, branches: Number(e.target.value) } })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Product Limit</label>
                  <Input
                    type="number"
                    value={newPlan.limits.products}
                    onChange={(e) => setNewPlan({ ...newPlan, limits: { ...newPlan.limits, products: Number(e.target.value) } })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">Features</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newPlan.features.map((feature, i) => (
                    <Badge key={i} className="bg-[#003D9B]/10 text-[#003D9B] dark:bg-[#0066FF]/20 dark:text-[#0066FF]">
                      {feature}
                      <button onClick={() => setNewPlan({ ...newPlan, features: newPlan.features.filter((_, f) => f !== i) })} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add feature"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (newFeature) {
                        setNewPlan({ ...newPlan, features: [...newPlan.features, newFeature] });
                        setNewFeature("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button
                className="flex-1 bg-[#003D9B] dark:bg-[#0066FF] text-white"
                onClick={handleCreatePlan}
                disabled={saving || !newPlan.name || !newPlan.price}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}