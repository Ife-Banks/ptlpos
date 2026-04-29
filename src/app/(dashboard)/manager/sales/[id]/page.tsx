"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Loader2,
  Printer,
  Receipt,
  RotateCcw,
  DollarSign,
  Package,
  User,
  Calendar,
  CreditCard,
  Banknote,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { salesApi } from "@/lib/api/sales";
import type { Sale, SaleStatus } from "@/types/api";
import { cn } from "@/lib/utils";

const getStatusBadge = (status: SaleStatus) => {
  switch (status) {
    case "ACTIVE":
      return { label: "Active", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "COMPLETED":
      return { label: "Completed", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
    case "HELD":
      return { label: "Held", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
    case "CANCELLED":
      return { label: "Cancelled", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    case "REFUNDED":
      return { label: "Refunded", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-700" };
  }
};

export default function SaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [returnItems, setReturnItems] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadSale();
    }
  }, [params.id]);

  const loadSale = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await salesApi.get(params.id as string);
      setSale(data);
    } catch (err) {
      setError("Failed to load sale");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!sale) return;
    setIsProcessing(true);
    try {
      await salesApi.refund(sale.id, { reason: refundReason });
      setRefundModalOpen(false);
      loadSale();
    } catch (err) {
      setError("Failed to process refund");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = async () => {
    if (!sale) return;
    try {
      const receipt = await salesApi.getPrintReceipt(sale.id);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(receipt);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (err) {
      console.error("Failed to print receipt", err);
    }
  };

  const handleViewReceipt = async () => {
    if (!sale) return;
    setReceiptModalOpen(true);
  };

  const handleReturn = async () => {
    if (!sale || returnItems.length === 0) return;
    setIsProcessing(true);
    try {
      await salesApi.refund(sale.id, { reason: `Return: ${refundReason}` });
      setReturnModalOpen(false);
      setReturnItems([]);
      setRefundReason("");
      loadSale();
    } catch (err) {
      setError("Failed to process return");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500">{error || "Sale not found"}</p>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(sale.status);

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewReceipt}>
            <Receipt className="mr-2 h-4 w-4" />
            View Receipt
          </Button>
          <Button variant="outline" onClick={handlePrintReceipt}>
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
          {sale.status === "COMPLETED" && (
            <>
              <Button
                variant="outline"
                onClick={() => setReturnModalOpen(true)}
                className="border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Return
              </Button>
              <Button
                variant="outline"
                onClick={() => setRefundModalOpen(true)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Refund
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sale Items</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="text-gray-600 dark:text-gray-400">Product</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400 text-right">Qty</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400 text-right">Price</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400 text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.product?.name || (item as any).productName || "Product"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-gray-600 dark:text-gray-400">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right text-gray-600 dark:text-gray-400">
                        ${Number(item.price || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                        ${Number(item.lineTotal || item.total || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h2>
            <div className="space-y-3">
              {sale.payments && sale.payments.length > 0 ? (
                sale.payments.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {payment.method || "CARD"}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${Number(payment.amount || 0).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No payments recorded</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sale Summary</h2>
              <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Sale Number</span>
                <span className="font-medium text-gray-900 dark:text-white">{sale.saleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Date</span>
                <span className="text-gray-900 dark:text-white">
                  {sale.createdAt ? new Date(sale.createdAt).toLocaleString() : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Customer</span>
                <span className="text-gray-900 dark:text-white">
                  {(sale as any).customer?.name || "Walk-in"}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">
                    ${Number(sale.subtotal || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Tax</span>
                  <span className="text-gray-900 dark:text-white">
                    ${Number(sale.taxAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Discount</span>
                  <span className="text-gray-900 dark:text-white">
                    -${Number(sale.discountAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">
                    ${Number(sale.totalAmount || sale.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {(sale as any).note && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Note</h2>
              <p className="text-gray-600 dark:text-gray-400">{(sale as any).note}</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={refundModalOpen} onOpenChange={setRefundModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Warning</span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                This will process a full refund for this sale. This action cannot be undone.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Refund Reason</label>
              <Input
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Enter reason for refund..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleRefund}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessing ? "Processing..." : "Confirm Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receipt - {sale?.saleNumber}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-white border rounded-lg p-6 font-mono text-sm">
              <div className="text-center border-b pb-4 mb-4">
                <h2 className="text-xl font-bold">RECEIPT</h2>
                <p className="text-gray-500">{sale?.saleNumber}</p>
                <p className="text-gray-500">
                  {sale?.createdAt ? new Date(sale.createdAt).toLocaleString() : ""}
                </p>
              </div>
              <div className="space-y-2 mb-4">
                {sale?.items?.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.quantity}x {item.product?.name || "Product"}</span>
                    <span>${Number(item.lineTotal || item.total || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${Number(sale?.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${Number(sale?.taxAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${Number(sale?.totalAmount || sale?.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiptModalOpen(false)}>Close</Button>
            <Button onClick={handlePrintReceipt} className="bg-[#003D9B] hover:bg-[#003D9B]/90">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={returnModalOpen} onOpenChange={setReturnModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Return/Exchange</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Return/Exchange</span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Select items to return and process an exchange.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Return Reason</label>
              <Input
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Enter reason for return..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleReturn}
              disabled={isProcessing}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isProcessing ? "Processing..." : "Process Return"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}