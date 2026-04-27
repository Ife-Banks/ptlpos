"use client";

import { Minus, Plus, Trash2, ShoppingCart, User, X, DollarSign, CreditCard, Wallet, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatCurrency } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";
import { useSettingsStore } from "@/stores/settings-store";

interface SaleItem {
  id: string;
  productId: string;
  product?: { id: string; name: string; price: number; sku: string };
  quantity: number;
  price: number;
  total: number;
  unitPrice: number;
  discount?: number;
  taxRate?: number;
  taxAmount?: number;
}

interface CartPanelProps {
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  attachedCustomer: { id: string; name: string; phone?: string } | null;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onAttachCustomer: () => void;
  onRemoveCustomer: () => void;
  onClearCart: () => void;
  onProceedToPayment: () => void;
  onHold?: () => void;
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
  onHold,
  isProcessing = false,
}: CartPanelProps) {
  const { theme } = useTheme();
  const { taxRate } = useSettingsStore();
  const isDark = theme === "dark";
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const displayTaxRate = taxRate || 7.5;

  return (
    <div className={cn(
      "flex flex-col h-full rounded-l-2xl",
      isDark ? "bg-gray-900" : "bg-white"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b",
        isDark ? "border-gray-800" : "border-gray-100"
      )}>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-[#003D9B] dark:text-[#0066FF]" />
          <h2 className={cn("font-semibold text-lg", isDark ? "text-white" : "text-gray-900")}>
            Cart
          </h2>
          {cartItemCount > 0 && (
            <span className="bg-[#003D9B] dark:bg-[#0066FF] text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {cartItemCount}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Customer Section */}
      <div className={cn("p-3 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
        {attachedCustomer ? (
          <div className={cn(
            "flex items-center justify-between p-2 rounded-lg",
            isDark ? "bg-gray-800" : "bg-gray-50"
          )}>
            <div className="flex items-center gap-2">
              <User className={cn("h-4 w-4", isDark ? "text-gray-400" : "text-gray-500")} />
              <div className="flex flex-col">
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
                  {attachedCustomer.name}
                </span>
                {attachedCustomer.phone && (
                  <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>
                    {attachedCustomer.phone}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onRemoveCustomer}
              className={isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onAttachCustomer}
            className={cn(
              "w-full text-sm",
              isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
            )}
          >
            <User className="h-4 w-4 mr-2" />
            Attach Customer
          </Button>
        )}
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <ShoppingCart className={cn("h-14 w-14 mb-3", isDark ? "text-gray-700" : "text-gray-300")} />
            <p className={cn("font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
              Cart is empty
            </p>
            <p className={cn("text-sm mt-1", isDark ? "text-gray-600" : "text-gray-400")}>
              Tap a product to add it
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item) => (
              <div key={item.id} className="p-3 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm truncate",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {item.product?.name || "Product"}
                  </p>
                  <p className={cn(
                    "text-xs font-mono",
                    isDark ? "text-gray-500" : "text-gray-500"
                  )}>
                    {formatCurrency((item.unitPrice || item.price || 0))} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1">
                  <Button
                    variant={isDark ? "outline" : "outline"}
                    size="icon-sm"
                    onClick={() => {
                      if (item.quantity > 1) {
                        onUpdateQuantity(item.id, item.quantity - 1);
                      } else {
                        onRemoveItem(item.id);
                      }
                    }}
                    disabled={isProcessing}
                    className={cn(
                      "h-7 w-7",
                      isDark ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"
                    )}
                  >
                    {item.quantity > 1 ? (
                      <Minus className="h-3 w-3" />
                    ) : (
                      <Trash2 className="h-3 w-3 text-red-500" />
                    )}
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      onUpdateQuantity(item.id, val);
                    }}
                    className={cn(
                      "w-10 h-7 text-center text-sm font-semibold px-1",
                      isDark 
                        ? "bg-gray-800 border-gray-700 text-white" 
                        : "bg-white border-gray-200 text-gray-900"
                    )}
                  />
                  <Button
                    variant={isDark ? "outline" : "outline"}
                    size="icon-sm"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isProcessing}
                    className={cn(
                      "h-7 w-7",
                      isDark ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"
                    )}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Item Total */}
                <div className="w-20 text-right">
                  <p className={cn(
                    "font-semibold text-sm",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    {formatCurrency(typeof item.total === 'number' ? item.total : 0)}
                  </p>
                  {(item.discount || 0) > 0 && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      -{formatCurrency(item.discount || 0)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Totals and Checkout */}
      <div className={cn(
        "border-t p-4 space-y-3",
        isDark ? "border-gray-800" : "border-gray-100"
      )}>
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className={isDark ? "text-gray-400" : "text-gray-500"}>Subtotal</span>
          <span className={isDark ? "text-white" : "text-gray-900"}>{formatCurrency(subtotal)}</span>
        </div>
        
        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className={isDark ? "text-gray-400" : "text-gray-500"}>Tax ({displayTaxRate}%)</span>
          <span className={isDark ? "text-gray-300" : "text-gray-700"}>{formatCurrency(tax)}</span>
        </div>

        {/* Discount */}
        {items.some(item => (item.discount || 0) > 0) && (
          <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
            <span>Discount</span>
            <span>-{formatCurrency(items.reduce((sum, item) => sum + (item.discount || 0), 0))}</span>
          </div>
        )}

        {/* Total */}
        <div className={cn(
          "flex justify-between text-xl font-bold pt-2 border-t",
          isDark ? "border-gray-800" : "border-gray-200"
        )}>
          <span className={isDark ? "text-white" : "text-gray-900"}>Total</span>
          <span className="text-[#003D9B] dark:text-[#0066FF]">{formatCurrency(total)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onHold && items.length > 0 && (
            <Button
              variant="outline"
              onClick={onHold}
              disabled={items.length === 0 || isProcessing}
              className={cn(
                "flex-1 h-10 text-sm",
                isDark ? "border-gray-700 hover:bg-gray-800" : ""
              )}
            >
              <Pause className="h-4 w-4 mr-1" />
              Hold
            </Button>
          )}
          <Button
            onClick={onProceedToPayment}
            disabled={items.length === 0 || isProcessing}
            className={cn(
              "flex-1 h-10 text-sm font-bold rounded-xl transition-all",
              "bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90",
              "text-white shadow-lg hover:shadow-xl",
              (items.length === 0 || isProcessing) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}