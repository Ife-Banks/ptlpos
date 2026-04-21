"use client";

import { useState, useEffect } from "react";
import { DollarSign, CreditCard, Wallet, Split, X, Loader2 } from "lucide-react";
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

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onComplete: (data: {
    paymentMethod: "CASH" | "CARD" | "OTHER";
    paidAmount: number;
    splitPayments?: { method: string; amount: number }[];
  }) => void;
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
  const [activeTab, setActiveTab] = useState<PaymentTab>("cash");
  const [cashTendered, setCashTendered] = useState("");
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
      setSplitPayments([{ method: "CASH", amount: "" }]);
    }
  }, [open]);

  const handleComplete = () => {
    if (activeTab === "cash") {
      onComplete({
        paymentMethod: "CASH",
        paidAmount: tenderedAmount,
      });
    } else if (activeTab === "card" || activeTab === "other") {
      onComplete({
        paymentMethod: activeTab === "card" ? "CARD" : "OTHER",
        paidAmount: total,
      });
    } else {
      const validSplits = splitPayments
        .filter(p => parseFloat(p.amount) > 0)
        .map(p => ({
          method: p.method,
          amount: parseFloat(p.amount)
        }));
      
      onComplete({
        paymentMethod: "CASH",
        paidAmount: splitTotal,
        splitPayments: validSplits,
      });
    }
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
    if (activeTab === "cash") {
      return tenderedAmount >= total;
    } else if (activeTab === "split") {
      return splitTotal >= total;
    }
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>

        <div className="text-center py-4 bg-surface rounded-lg">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-4xl font-bold text-primary">{formatCurrency(total)}</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PaymentTab)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="cash" className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Cash</span>
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Card</span>
            </TabsTrigger>
            <TabsTrigger value="other" className="flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Other</span>
            </TabsTrigger>
            <TabsTrigger value="split" className="flex items-center gap-1">
              <Split className="h-4 w-4" />
              <span className="hidden sm:inline">Split</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cash" className="space-y-4">
            <div className="space-y-2">
              <Label>Amount Tendered</Label>
              <Input
                type="number"
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                placeholder="0.00"
                className="text-lg h-12"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[total, 50, 100, 200].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setCashTendered(String(amount))}
                  className="text-sm"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <div className={cn(
              "text-center py-3 rounded-lg",
              change >= 0 ? "bg-success-bg text-success" : "bg-warning-bg text-warning"
            )}>
              <p className="text-sm">Change Due</p>
              <p className="text-2xl font-bold">
                {formatCurrency(Math.abs(change))}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Ready for card payment</p>
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <div className="text-center py-8">
              <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Other payment method</p>
            </div>
          </TabsContent>

          <TabsContent value="split" className="space-y-4">
            <div className="space-y-2">
              {splitPayments.map((split, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={split.method}
                    onChange={(e) => updateSplitRow(index, "method", e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                    className="flex-1"
                  />
                  {splitPayments.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSplitRow(index)}
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

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Split Total</span>
                <span className={splitTotal >= total ? "text-success" : "text-warning"}>
                  {formatCurrency(splitTotal)}
                </span>
              </div>
              {splitRemaining > 0 && (
                <div className="flex justify-between text-warning">
                  <span>Remaining</span>
                  <span>{formatCurrency(splitRemaining)}</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={!canComplete() || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Sale"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}