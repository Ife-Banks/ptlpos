"use client";

import { useState } from "react";
import { Printer, Mail, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ReceiptCustomer {
  name: string;
}

interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

const mockReceipt: {
  saleNumber: string;
  createdAt: string;
  customer?: ReceiptCustomer;
  items: ReceiptItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  payments: { id: string; method: string; amount: number }[];
} = {
  saleNumber: "SAL-2024-1234",
  createdAt: "2024-10-15 10:30:45",
  customer: undefined,
  items: [
    { id: "1", name: "Widget A", quantity: 2, price: 25.0, total: 50.0 },
    { id: "2", name: "Gadget X", quantity: 1, price: 49.99, total: 49.99 },
    { id: "3", name: "Cable Set", quantity: 3, price: 12.0, total: 36.0 },
  ],
  subtotal: 135.99,
  taxAmount: 10.2,
  discountAmount: 0,
  total: 146.19,
  payments: [
    { id: "1", method: "CASH", amount: 150.0 },
  ],
};

export default function ReceiptPage() {
  const [isLoading, setIsLoading] = useState(false);
  const sale = mockReceipt;

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    alert("Email receipt functionality would be implemented here");
  };

  const handleNewSale = () => {
    window.location.href = "/pos";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">PTLPOS</h2>
              <p className="text-sm text-gray-500">123 Business Street</p>
              <p className="text-sm text-gray-500">City, State 12345</p>
            </div>

            <div className="border-t border-b border-dashed py-4 mb-4">
              <div className="flex justify-between text-sm">
                <span>Receipt #</span>
                <span className="font-mono">{sale.saleNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Date</span>
                <span>{sale.createdAt}</span>
              </div>
{sale.customer && sale.customer.name ? (
                <div className="flex justify-between text-sm">
                  <span>Customer</span>
                  <span>{sale.customer.name}</span>
                </div>
              ) : null}
              </div>

            <div className="space-y-2 mb-4">
              {sale.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500"> x {item.quantity}</span>
                  </div>
                  <span>{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(sale.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(sale.taxAmount)}</span>
              </div>
              {sale.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(sale.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(sale.total)}</span>
              </div>
            </div>

            {sale.payments && sale.payments.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Payment Method:</p>
                {sale.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between text-sm">
                    <span>{payment.method}</span>
                    <span>{formatCurrency(payment.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium text-green-600 mt-2">
                  <span>Change</span>
                  <span>{formatCurrency(sale.payments[0].amount - sale.total)}</span>
                </div>
              </div>
            )}

            <div className="text-center mt-6 pt-4 border-t text-sm text-gray-500">
              <p>Thank you for your purchase!</p>
              <p>Please come again</p>
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full mt-6"
          size="lg"
          onClick={handleNewSale}
        >
          New Sale
        </Button>
      </div>
    </div>
  );
}