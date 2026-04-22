"use client";

import { useState, useEffect } from "react";
import { DollarSign, CreditCard, Wallet, Split, X, Loader2, Check, ArrowLeft } from "lucide-react";
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
  onComplete: () => void;
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

  const tenderedAmount = parseFloat(cashTendered) || 0;
  const change = tenderedAmount - total;

  const splitTotal = splitPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const splitRemaining = total - splitTotal;

  useEffect(() => {
    if (open) {
      setCashTendered("");
      setActiveTab("cash");
      setIsComplete(false);
      setSplitPayments([{ method: "CASH", amount: "" }]);
    }
  }, [open]);

  const handleComplete = () => {
    onComplete();
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

  const quickAmounts = [total, 50, 100, 200, 500];

  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-sm text-center">
          <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
            {change > 0 && (
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Change due: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(change)}</span>
              </p>
            )}
            <Button onClick={onClose} className="w-full bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white">
              Done - New Sale
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-md", isDark ? "bg-gray-900" : "bg-white")}>
        <DialogHeader>
          <DialogTitle className={isDark ? "text-white" : "text-gray-900"}>Complete Payment</DialogTitle>
        </DialogHeader>

        {/* Total Display */}
        <div className={cn(
          "text-center py-4 rounded-xl",
          isDark ? "bg-gray-800" : "bg-gray-100"
        )}>
          <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Total Amount</p>
          <p className="text-4xl font-bold text-[#003D9B] dark:text-[#0066FF]">{formatCurrency(total)}</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PaymentTab)}>
          <TabsList className={cn("grid w-full", isDark ? "bg-gray-800" : "bg-gray-100")}>
            <TabsTrigger 
              value="cash" 
              className={cn(
                "flex items-center gap-1",
                isDark ? "data-[state=active]:bg-gray-700" : ""
              )}
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Cash</span>
            </TabsTrigger>
            <TabsTrigger value="card">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Card</span>
            </TabsTrigger>
            <TabsTrigger value="other">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Other</span>
            </TabsTrigger>
            <TabsTrigger value="split">
              <Split className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {/* Cash Payment */}
          <TabsContent value="cash" className="space-y-4">
            <div className="space-y-2">
              <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Amount Tendered</Label>
              <Input
                type="number"
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                placeholder="0.00"
                className={cn(
                  "text-lg h-12",
                  isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
                )}
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setCashTendered(String(amount))}
                  className={cn(
                    "text-sm font-semibold",
                    isDark ? "border-gray-700 hover:bg-gray-800" : ""
                  )}
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <div className={cn(
              "text-center py-3 rounded-lg font-bold",
              change >= 0 
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" 
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            )}>
              <p className="text-sm">Change Due</p>
              <p className="text-2xl">{formatCurrency(Math.abs(change))}</p>
            </div>
          </TabsContent>

          {/* Card Payment */}
          <TabsContent value="card" className="space-y-4">
            <div className="text-center py-8">
              <CreditCard className={cn("h-16 w-16 mx-auto mb-4", isDark ? "text-gray-500" : "text-gray-400")} />
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>Ready for card payment</p>
              <p className={cn("text-sm mt-2", isDark ? "text-gray-500" : "text-gray-400")}>
                Amount: <span className="font-bold">{formatCurrency(total)}</span>
              </p>
            </div>
          </TabsContent>

          {/* Other Payment */}
          <TabsContent value="other" className="space-y-4">
            <div className="text-center py-8">
              <Wallet className={cn("h-16 w-16 mx-auto mb-4", isDark ? "text-gray-500" : "text-gray-400")} />
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>Other payment method</p>
              <p className={cn("text-sm mt-2", isDark ? "text-gray-500" : "text-gray-400")}>
                Amount: <span className="font-bold">{formatCurrency(total)}</span>
              </p>
            </div>
          </TabsContent>

          {/* Split Payment */}
          <TabsContent value="split" className="space-y-4">
            <div className="space-y-2">
              {splitPayments.map((split, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={split.method}
                    onChange={(e) => updateSplitRow(index, "method", e.target.value)}
                    className={cn(
                      "h-10 rounded-md border px-3 py-2 text-sm",
                      isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
                    )}
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <Input
                    type="number"
                    value={split.amount}
                    onChange={(e) => updateSplitRow(index, "amount", e.target.value)}
                    placeholder="0.00"
                    className={cn(
                      "flex-1",
                      isDark ? "bg-gray-800 border-gray-700" : ""
                    )}
                  />
                  {splitPayments.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSplitRow(index)}
                      className="text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button variant="outline" onClick={addSplitRow} className="w-full">
                + Add Payment Method
              </Button>
            </div>

            <div className={cn("space-y-2 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
              <div className="flex justify-between">
                <span>Total Due</span>
                <span className="font-bold">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Given</span>
                <span className={cn(
                  "font-bold",
                  splitTotal >= total ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"
                )}>
                  {formatCurrency(splitTotal)}
                </span>
              </div>
              {splitRemaining > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Remaining</span>
                  <span>{formatCurrency(splitRemaining)}</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isProcessing}
            className={isDark ? "border-gray-700" : ""}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={!canComplete() || isProcessing}
            className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Complete - ${formatCurrency(activeTab === "cash" ? tenderedAmount : total)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}