"use client";

import { useState, useEffect } from "react";
import { DollarSign, CreditCard, Wallet, Split, X, Loader2, Check, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn, formatCurrency } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onComplete: (paymentData: { method: string; amount: number }) => void;
  isProcessing?: boolean;
}

type PaymentTab = "cash" | "card" | "other" | "split";

export function PaymentModal({ 
  open, 
  onClose, 
  total, 
  onComplete,
  isProcessing = false 
}: PaymentModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<PaymentTab>("cash");
  const [cashTendered, setCashTendered] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [splitPayments, setSplitPayments] = useState<{ method: string; amount: string }[]>([
    { method: "CASH", amount: "" }
  ]);
  const [otherMethod, setOtherMethod] = useState<"TRANSFER" | "STORE_CREDIT" | null>(null);

  const tenderedAmount = parseFloat(cashTendered) || 0;
  const change = tenderedAmount - total;
  const isExactChange = Math.abs(change) < 0.01;

  const splitTotal = splitPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const splitRemaining = total - splitTotal;

  useEffect(() => {
    if (open) {
      setCashTendered("");
      setActiveTab("cash");
      setIsComplete(false);
      setSplitPayments([{ method: "CASH", amount: "" }]);
      setOtherMethod(null);
    }
  }, [open]);

const handleComplete = () => {
      let paymentData: { method: string; amount: number };
      
      if (activeTab === "cash") {
        paymentData = { 
          method: "CASH", 
          amount: parseFloat(cashTendered) || 0 
        };
      } else if (activeTab === "card") {
        paymentData = { 
          method: "CARD", 
          amount: total 
        };
      } else if (activeTab === "other") {
        // Handle TRANSFER and STORE_CREDIT
        if (otherMethod === "TRANSFER") {
          paymentData = { 
            method: "TRANSFER", 
            amount: total 
          };
        } else if (otherMethod === "STORE_CREDIT") {
          paymentData = { 
            method: "STORE_CREDIT", 
            amount: total 
          };
        } else {
          paymentData = { 
            method: "OTHER", 
            amount: total 
          };
        }
      } else { // split
        // For split, we'll use the first payment method for simplicity
        // In a real implementation, you might want to create multiple payments
        const firstPayment = splitPayments[0];
        paymentData = { 
          method: firstPayment.method as "CASH" | "CARD" | "OTHER" | "TRANSFER" | "STORE_CREDIT",
          amount: parseFloat(firstPayment.amount) || 0
        };
      }
      
      onComplete(paymentData);
      setIsComplete(true);
    };

  const addSplitRow = () => {
    setSplitPayments([...splitPayments, { method: "CASH", amount: "" }]);
  };

  const removeSplitRow = (index: number) => {
    setSplitPayments(splitPayments.filter((_, i) => i !== index));
  };

  const updateSplitRow = (index: number, field: "method" | "amount", value: string) => {
    const updated = [...splitPayments];
    updated[index][field] = value;
    setSplitPayments(updated);
  };

  const canComplete = () => {
    if (activeTab === "cash") return tenderedAmount >= total;
    if (activeTab === "split") return splitTotal >= total;
    return true;
  };

  const quickAmounts = [
    { label: "Exact", value: Math.ceil(total) },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "200", value: 200 },
    { label: "500", value: 500 },
  ];

  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={cn("max-w-4xl text-center", isDark ? "bg-gray-900" : "bg-white")}>
          <div className="flex flex-col items-center py-8">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center mb-6",
              isDark ? "bg-emerald-500/20" : "bg-emerald-100"
            )}>
              <Check className={cn("h-12 w-12", isDark ? "text-emerald-400" : "text-emerald-600")} />
            </div>
            <h2 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>
              Payment Successful!
            </h2>
            <p className={cn("text-lg mb-6", isDark ? "text-gray-400" : "text-gray-500")}>
              Sale completed successfully
            </p>
            {change > 0 && (
              <div className={cn(
                "px-6 py-3 rounded-lg mb-6",
                isDark ? "bg-emerald-500/20" : "bg-emerald-50"
              )}>
                <p className={cn("text-sm", isDark ? "text-emerald-400" : "text-emerald-600")}>
                  Change Due
                </p>
                <p className={cn("text-3xl font-bold", isDark ? "text-emerald-400" : "text-emerald-700")}>
                  {formatCurrency(change)}
                </p>
              </div>
            )}
            <Button 
              onClick={onClose} 
              className={cn(
                "w-full h-12 text-base font-semibold",
                "bg-emerald-600 hover:bg-emerald-700 text-white"
              )}
            >
              <Banknote className="h-5 w-5 mr-2" />
              Done - New Sale
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-4xl ",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <DialogHeader className={cn("pb-4 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
          <DialogTitle className={cn("text-xl font-bold flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
            <DollarSign className={cn("h-6 w-6", isDark ? "text-emerald-400" : "text-emerald-600")} />
            Complete Payment
          </DialogTitle>
        </DialogHeader>

        {/* Total Display - Prominent */}
        <div className={cn(
          "py-6 rounded-xl text-center",
          isDark ? "bg-gradient-to-r from-gray-800 to-gray-850" : "bg-gradient-to-r from-gray-50 to-gray-100"
        )}>
          <p className={cn("text-sm font-medium mb-1", isDark ? "text-gray-400" : "text-gray-500")}>
            Amount Due
          </p>
          <p className={cn(
            "text-5xl font-bold tracking-tight",
            isDark ? "text-white" : "text-gray-900"
          )}>
            {formatCurrency(total)}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PaymentTab)}>
          <TabsList className={cn(
            "grid w-full h-auto p-1 rounded-lg",
            isDark ? "bg-gray-800/50" : "bg-gray-100"
          )}>
            <TabsTrigger 
              value="cash" 
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-md transition-all",
                isDark 
                  ? "data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400" 
                  : "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
              )}
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Cash</span>
            </TabsTrigger>
            <TabsTrigger 
              value="card"
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-md transition-all",
                isDark 
                  ? "data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400" 
                  : "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
              )}
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Card</span>
            </TabsTrigger>
            <TabsTrigger 
              value="other"
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-md transition-all",
                isDark 
                  ? "data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400" 
                  : "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
              )}
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Other</span>
            </TabsTrigger>
            <TabsTrigger 
              value="split"
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-md transition-all",
                isDark 
                  ? "data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-400" 
                  : "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
              )}
            >
              <Split className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {/* Cash Payment */}
          <TabsContent value="cash" className="space-y-4 pt-4">
            <div className="space-y-3">
              <Label className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
                Amount Tendered
              </Label>
              <div className="relative">
                <span className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-medium",
                  isDark ? "text-gray-500" : "text-gray-400"
                )}>
                  $
                </span>
                <Input
                  type="number"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "text-2xl h-14 pl-10 pr-4 text-right font-semibold",
                    isDark ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : "bg-white border-gray-200 placeholder:text-gray-400"
                  )}
                  autoFocus
                />
              </div>
            </div>
            
            {/* Quick Amounts */}
            <div className="space-y-2">
              <p className={cn("text-xs font-medium", isDark ? "text-gray-500" : "text-gray-500")}>
                Quick Amounts
              </p>
              <div className="grid grid-cols-5 gap-2">
                {quickAmounts.map((item) => (
                  <Button
                    key={item.value}
                    variant="outline"
                    onClick={() => setCashTendered(String(item.value))}
                    className={cn(
                      "h-11 text-sm font-semibold transition-all",
                      cashTendered === String(item.value)
                        ? isDark 
                          ? "bg-emerald-600 border-emerald-600 text-white" 
                          : "bg-emerald-600 border-emerald-600 text-white"
                        : isDark 
                          ? "border-gray-700 hover:bg-gray-700 text-gray-300 hover:text-white" 
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    )}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Change Display */}
            <div className={cn(
              "p-4 rounded-xl text-center",
              change >= 0 
                ? isExactChange
                  ? isDark ? "bg-emerald-500/20" : "bg-emerald-50"
                  : isDark ? "bg-blue-500/20" : "bg-blue-50"
                : isDark ? "bg-red-500/20" : "bg-red-50"
            )}>
              <p className={cn("text-sm font-medium mb-1",
                change >= 0 
                  ? isExactChange
                    ? isDark ? "text-emerald-400" : "text-emerald-600"
                    : isDark ? "text-blue-400" : "text-blue-600"
                  : isDark ? "text-red-400" : "text-red-600"
              )}>
                {change > 0 ? "Change Due" : change < 0 ? "Amount Short" : "Exact Amount"}
              </p>
              <p className={cn(
                "text-3xl font-bold",
                change >= 0 
                  ? isExactChange
                    ? isDark ? "text-emerald-400" : "text-emerald-700"
                    : isDark ? "text-blue-400" : "text-blue-700"
                  : isDark ? "text-red-400" : "text-red-700"
              )}>
                {formatCurrency(Math.abs(change))}
              </p>
            </div>
          </TabsContent>

          {/* Card Payment */}
          <TabsContent value="card" className="pt-6">
            <div className={cn(
              "flex flex-col items-center justify-center py-12 rounded-xl",
              isDark ? "bg-gray-800/50" : "bg-gray-50"
            )}>
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mb-4",
                isDark ? "bg-blue-500/20" : "bg-blue-100"
              )}>
                <CreditCard className={cn("h-10 w-10", isDark ? "text-blue-400" : "text-blue-600")} />
              </div>
              <p className={cn("text-lg font-medium mb-1", isDark ? "text-white" : "text-gray-900")}>
                Card Payment
              </p>
              <p className={cn("text-sm mb-4", isDark ? "text-gray-400" : "text-gray-500")}>
                Tap, insert, or swipe card to pay
              </p>
              <p className={cn(
                "text-2xl font-bold",
                isDark ? "text-white" : "text-gray-900"
              )}>
                {formatCurrency(total)}
              </p>
            </div>
          </TabsContent>

          {/* Other Payment */}
          <TabsContent value="other" className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setOtherMethod("TRANSFER")}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                  otherMethod === "TRANSFER"
                    ? isDark ? "border-purple-500 bg-purple-500/20" : "border-purple-500 bg-purple-50"
                    : isDark ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                  isDark ? "bg-purple-500/20" : "bg-purple-100"
                )}>
                  <Wallet className={cn("h-6 w-6", isDark ? "text-purple-400" : "text-purple-600")} />
                </div>
                <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Bank Transfer</span>
                <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>Transfer to account</span>
              </button>
              <button
                onClick={() => setOtherMethod("STORE_CREDIT")}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                  otherMethod === "STORE_CREDIT"
                    ? isDark ? "border-amber-500 bg-amber-500/20" : "border-amber-500 bg-amber-50"
                    : isDark ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                  isDark ? "bg-amber-500/20" : "bg-amber-100"
                )}>
                  <CreditCard className={cn("h-6 w-6", isDark ? "text-amber-400" : "text-amber-600")} />
                </div>
                <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Store Credit</span>
                <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>Use customer credit</span>
              </button>
            </div>
            {otherMethod && (
              <div className={cn(
                "p-4 rounded-xl text-center",
                isDark ? "bg-gray-800/50" : "bg-gray-50"
              )}>
                <p className={cn("text-sm mb-1", isDark ? "text-gray-400" : "text-gray-500")}>
                  Pay with {otherMethod === "TRANSFER" ? "Bank Transfer" : "Store Credit"}
                </p>
                <p className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {formatCurrency(total)}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Split Payment */}
          <TabsContent value="split" className="space-y-4 pt-4">
            <div className="space-y-3">
              {splitPayments.map((split, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select
                    value={split.method}
                    onChange={(e) => updateSplitRow(index, "method", e.target.value)}
                    className={cn(
                      "h-11 w-32 rounded-lg border px-3 text-sm font-medium",
                      isDark 
                        ? "bg-gray-800 border-gray-700 text-white" 
                        : "bg-white border-gray-200 text-gray-700"
                    )}
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <div className="relative flex-1">
                    <span className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium",
                      isDark ? "text-gray-500" : "text-gray-400"
                    )}>
                      $
                    </span>
                    <Input
                      type="number"
                      value={split.amount}
                      onChange={(e) => updateSplitRow(index, "amount", e.target.value)}
                      placeholder="0.00"
                      className={cn(
                        "h-11 pl-8 pr-4 text-right font-medium",
                        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
                      )}
                    />
                  </div>
                  {splitPayments.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSplitRow(index)}
                      className={cn(
                        "h-11 w-11",
                        isDark ? "text-gray-400 hover:text-red-400 hover:bg-red-500/20" : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                      )}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button 
                variant="outline" 
                onClick={addSplitRow} 
                className={cn(
                  "w-full h-11 font-medium",
                  isDark ? "border-gray-700 hover:bg-gray-800 text-gray-300" : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <Split className="h-4 w-4 mr-2" />
                Add Another Payment
              </Button>
            </div>

            {/* Split Summary */}
            <div className={cn(
              "p-4 rounded-xl space-y-3",
              isDark ? "bg-gray-800/50" : "bg-gray-50"
            )}>
              <div className="flex justify-between text-sm">
                <span className={isDark ? "text-gray-400" : "text-gray-500"}>Total Due</span>
                <span className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {formatCurrency(total)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? "text-gray-400" : "text-gray-500"}>Amount Tendered</span>
                <span className={cn(
                  "font-bold",
                  splitTotal >= total 
                    ? isDark ? "text-emerald-400" : "text-emerald-600"
                    : isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  {formatCurrency(splitTotal)}
                </span>
              </div>
              {splitRemaining > 0 && (
                <div className={cn("flex justify-between text-sm pt-2 border-t", isDark ? "border-gray-700" : "border-gray-200")}>
                  <span className={isDark ? "text-amber-400" : "text-amber-600"}>Remaining</span>
                  <span className={cn("font-bold", isDark ? "text-amber-400" : "text-amber-600")}>
                    {formatCurrency(splitRemaining)}
                  </span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className={cn("pt-4 border-t", isDark ? "border-gray-800" : "border-gray-100")}>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isProcessing}
            className={cn(
              "h-11 px-6",
              isDark ? "border-gray-700 hover:bg-gray-800" : ""
            )}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={!canComplete() || isProcessing}
            className={cn(
              "h-11 px-8 font-semibold",
              "bg-emerald-600 hover:bg-emerald-700 text-white"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Complete Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}