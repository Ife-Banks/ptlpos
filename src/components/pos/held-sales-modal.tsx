"use client";

import { useState, useEffect } from "react";
import { Pause, Play, ShoppingCart, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { salesApi } from "@/lib/api/sales";
import { cn, formatCurrency } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";
import type { Sale } from "@/types/api";

interface HeldSalesModalProps {
  open: boolean;
  onClose: () => void;
  onResumeSale: (sale: Sale) => void;
}

export function HeldSalesModal({ open, onClose, onResumeSale }: HeldSalesModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [heldSales, setHeldSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [resuming, setResuming] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchHeldSales();
    }
  }, [open]);

  const fetchHeldSales = async () => {
    setLoading(true);
    try {
      const response = await salesApi.list({ status: "HELD", limit: 20 });
      setHeldSales(response.data || []);
    } catch (err) {
      console.error("Failed to fetch held sales:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSale = async (sale: Sale) => {
    setResuming(sale.id);
    try {
      const resumedSale = await salesApi.resume(sale.id);
      onResumeSale(resumedSale);
    } catch (err) {
      console.error("Failed to resume sale:", err);
      onResumeSale(sale);
    } finally {
      setResuming(null);
    }
  };

  const handleCancelSale = async (saleId: string) => {
    if (!confirm("Are you sure you want to cancel this sale?")) return;
    
    try {
      await salesApi.cancel(saleId);
      setHeldSales(prev => prev.filter(s => s.id !== saleId));
    } catch (err) {
      console.error("Failed to cancel sale:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-4xl", isDark ? "bg-gray-900" : "bg-white")}>
        <DialogHeader>
          <DialogTitle className={cn(
            "flex items-center gap-2",
            isDark ? "text-white" : "text-gray-900"
          )}>
            <Pause className="h-5 w-5 text-emerald-600" />
            Held Sales
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[400px] overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#003D9B]" />
            </div>
          ) : heldSales.length === 0 ? (
            <div className="text-center py-12">
              <Pause className={cn(
                "h-12 w-12 mx-auto mb-3",
                isDark ? "text-gray-700" : "text-gray-300"
              )} />
              <p className={cn(
                "font-medium",
                isDark ? "text-gray-400" : "text-gray-500"
              )}>
                No held sales
              </p>
              <p className={cn(
                "text-sm mt-1",
                isDark ? "text-gray-600" : "text-gray-400"
              )}>
                Use the Hold button to save sales for later
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {heldSales.map((sale) => (
                <div
                  key={sale.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    isDark 
                      ? "bg-gray-800 border-gray-700" 
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      {sale.customer ? (
                        <p className={cn(
                          "font-medium",
                          isDark ? "text-white" : "text-gray-900"
                        )}>
                          {sale.customer.name}
                        </p>
                      ) : (
                        <p className={cn(
                          "font-medium italic",
                          isDark ? "text-gray-500" : "text-gray-400"
                        )}>
                          Walk-in Customer
                        </p>
                      )}
                      <p className={cn(
                        "text-xs mt-1",
                        isDark ? "text-gray-500" : "text-gray-500"
                      )}>
                        {new Date(sale.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-lg font-bold",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        {formatCurrency(sale.total)}
                      </p>
                      <p className={cn(
                        "text-xs",
                        isDark ? "text-gray-500" : "text-gray-500"
                      )}>
                        {sale.items?.length || 0} items
                      </p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className={cn(
                    "mb-3 p-2 rounded-md",
                    isDark ? "bg-gray-900/50" : "bg-white"
                  )}>
                    <div className="text-xs space-y-1">
                      {sale.items?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                            {item.quantity}x {item.product?.name || "Product"}
                          </span>
                          <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                      ))}
                      {(sale.items?.length || 0) > 3 && (
                        <p className={cn(
                          "text-center text-xs pt-1",
                          isDark ? "text-gray-600" : "text-gray-400"
                        )}>
                          +{(sale.items?.length || 0) - 3} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleResumeSale(sale)}
                      disabled={resuming === sale.id}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {resuming === sale.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Resume
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCancelSale(sale.id)}
                      className={cn(
                        "text-red-600 border-red-200 hover:bg-red-50",
                        isDark ? "border-red-800 hover:bg-red-900/20" : ""
                      )}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}