"use client";

import { Minus, Plus, Trash2, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatCurrency } from "@/lib/utils";
import type { SaleItem } from "@/types/api";

interface CartPanelProps {
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  attachedCustomer: { id: string; name: string } | null;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onAttachCustomer: () => void;
  onRemoveCustomer: () => void;
  onClearCart: () => void;
  onProceedToPayment: () => void;
  isProcessing?: boolean;
}

export function CartPanel({
  items,
  subtotal,
  tax,
  total,
  attachedCustomer,
  onUpdateQuantity,
  onRemoveItem,
  onAttachCustomer,
  onRemoveCustomer,
  onClearCart,
  onProceedToPayment,
  isProcessing = false,
}: CartPanelProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-border-light">
      <div className="flex items-center justify-between p-4 border-b border-border-light">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Cart</h2>
          {items.length > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="text-error hover:text-error hover:bg-error-bg"
          >
            Clear
          </Button>
        )}
      </div>

      <div className="p-3 border-b border-border-light">
        {attachedCustomer ? (
          <div className="flex items-center justify-between bg-surface rounded-md p-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{attachedCustomer.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onRemoveCustomer}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onAttachCustomer}
            className="w-full"
          >
            <User className="h-4 w-4 mr-2" />
            Attach Customer
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Search or scan a product to start</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {items.map((item) => (
              <div key={item.id} className="p-3 flex gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.product?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(item.unitPrice)} each
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => {
                      if (item.quantity > 1) {
                        onUpdateQuantity(item.id, item.quantity - 1);
                      } else {
                        onRemoveItem(item.id);
                      }
                    }}
                    disabled={isProcessing}
                  >
                    {item.quantity > 1 ? (
                      <Minus className="h-3 w-3" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isProcessing}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <div className="w-16 text-right">
                  <p className="font-semibold text-sm">
                    {formatCurrency(item.total)}
                  </p>
                  {item.discount > 0 && (
                    <p className="text-xs text-success">-{formatCurrency(item.discount)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-border-light p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>

        {items.some(item => item.discount > 0) && (
          <div className="flex justify-between text-sm text-success">
            <span>Discount</span>
            <span>-{formatCurrency(items.reduce((sum, item) => sum + item.discount, 0))}</span>
          </div>
        )}

        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border-light">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>

        <Button
          onClick={onProceedToPayment}
          disabled={items.length === 0 || isProcessing}
          className="w-full h-12 text-lg"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </div>
  );
}