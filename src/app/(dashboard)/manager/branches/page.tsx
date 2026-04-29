"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Loader2,
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { branchesApi, Branch } from "@/lib/api/branches";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 20;

export default function ManagerBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBranches();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    loadBranches();
  };

  const loadBranches = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await branchesApi.list({
        page: 1,
        limit: ITEMS_PER_PAGE,
      });
      const arr = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      setBranches(arr);
      if (arr.length > 0 && !selectedBranch) {
        setSelectedBranch(arr[0]);
      }
    } catch (err) {
      setError("Failed to load branches");
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = branches.filter((branch) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      branch.name?.toLowerCase().includes(query) ||
      branch.city?.toLowerCase().includes(query) ||
      branch.address?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Branches</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View your assigned branches</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
              </div>
            ) : filteredBranches.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No branches found
              </div>
            ) : (
              filteredBranches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    selectedBranch?.id === branch.id && "bg-gray-50 dark:bg-gray-800"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-[#003D9B] dark:text-[#0066FF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {branch.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {branch.city}{branch.state ? `, ${branch.state}` : ""}
                      </p>
                    </div>
                    {branch.isDefault && (
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1">
          {selectedBranch ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-[#003D9B] dark:text-[#0066FF]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedBranch.name}
                    </h2>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </Badge>
                    {selectedBranch.isDefault && (
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Branch Details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">Location</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          {selectedBranch.address || "No address"}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {[selectedBranch.city, selectedBranch.state, selectedBranch.zipCode]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {selectedBranch.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                        <p className="text-gray-900 dark:text-white">
                          {selectedBranch.createdAt
                            ? new Date(selectedBranch.createdAt).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Select a branch to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}