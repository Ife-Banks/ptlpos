"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { RotateCcw, Pause, UserPlus, Store, Bell, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductSearch } from "@/components/pos/product-search";
import { ProductCard } from "@/components/pos/product-card";
import { CartPanel } from "@/components/pos/cart-panel";
import { PaymentModal } from "@/components/pos/payment-modal";
import { usePOSStore } from "@/stores/pos-store";
import { useAuthStore } from "@/stores";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

interface CartItem {
  id: string;
  productId: string;
  product: { id: string; name: string; price: number; sku: string };
  quantity: number;
  price: number;
  total: number;
  saleId: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
}

const mockProducts = [
  { id: "1", name: "Premium Widget A", sku: "WGT-001", price: 25.00, category: "Electronics", stock: 45 },
  { id: "2", name: "Smart Gadget X", sku: "GDG-012", price: 49.99, category: "Electronics", stock: 23 },
  { id: "3", name: "Component Y", sku: "CMP-034", price: 15.00, category: "Parts", stock: 89 },
  { id: "4", name: "Part Z", sku: "PRT-056", price: 8.50, category: "Parts", stock: 156 },
  { id: "5", name: "Assembly Kit Pro", sku: "ASM-001", price: 125.00, category: "Kits", stock: 12 },
  { id: "6", name: "Power Supply Unit", sku: "PWR-012", price: 35.00, category: "Electronics", stock: 34 },
  { id: "7", name: "Display Module AMOLED", sku: "DSP-034", price: 89.00, category: "Electronics", stock: 18 },
  { id: "8", name: "Cable Set Deluxe", sku: "CBL-001", price: 12.00, category: "Accessories", stock: 67 },
  { id: "9", name: "Connector Pack", sku: "CNT-001", price: 3.50, category: "Parts", stock: 234 },
  { id: "10", name: "Mounting Kit", sku: "MNT-001", price: 18.00, category: "Kits", stock: 45 },
  { id: "11", name: "Sensor Module", sku: "SNS-001", price: 45.00, category: "Electronics", stock: 28 },
  { id: "12", name: "Switch Board", sku: "SWT-001", price: 22.00, category: "Electronics", stock: 56 },
  { id: "13", name: "LED Panel 50in", sku: "LED-001", price: 65.00, category: "Electronics", stock: 15 },
  { id: "14", name: "Wiring Harness", sku: "WHR-001", price: 28.00, category: "Parts", stock: 78 },
  { id: "15", name: "Capacitor Pack", sku: "CAP-010", price: 5.00, category: "Parts", stock: 312 },
  { id: "16", name: "USB-C Hub", sku: "USB-001", price: 15.00, category: "Accessories", stock: 89 },
];

const categories = ["All", "Electronics", "Parts", "Kits", "Accessories"];

export default function POSTerminalPage() {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const { isPaymentModalOpen, setPaymentModalOpen } = usePOSStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [attachedCustomer, setAttachedCustomer] = useState<{ id: string; name: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const isDark = theme === "dark";

  const filteredProducts = mockProducts.filter((product) => {
    return selectedCategory === "All" || product.category === selectedCategory;
  });

  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.total || 0), 0);
  const cartTax = cartSubtotal * 0.075;
  const cartTotal = cartSubtotal + cartTax;

  const handleSelectProduct = useCallback((product: { id: string; name: string; price: number; sku: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          product: { id: product.id, name: product.name, price: product.price, sku: product.sku },
          quantity: 1,
          price: product.price,
          total: product.price,
          saleId: "",
          unitPrice: product.price,
          discount: 0,
          taxRate: 7.5,
          taxAmount: product.price * 0.075,
        },
      ];
    });
  }, []);

  const handleUpdateQuantity = useCallback((itemId: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity < 1) {
        return prev.filter((item) => item.id !== itemId);
      }
      return prev.map((item) =>
        item.id === itemId
          ? { 
              ...item, 
              quantity, 
              total: quantity * item.price,
              taxAmount: (quantity * item.price) * 0.075,
            }
          : item
      );
    });
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
    setAttachedCustomer(null);
  }, []);

  const handlePaymentComplete = useCallback(async () => {
    setPaymentModalOpen(false);
    handleClearCart();
  }, [setPaymentModalOpen, handleClearCart]);

  const getUserInitial = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Top Bar */}
      <header className={cn(
        "flex items-center justify-between px-4 py-2 border-b",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#003D9B] dark:bg-[#0066FF] rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#003D9B] dark:text-[#0066FF]">PTLPOS</span>
          </div>
          <div className={cn("h-6 w-px bg-gray-300 dark:bg-gray-700")} />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className={isDark ? "text-gray-300" : "text-gray-600"}>
              <UserPlus className="h-4 w-4 mr-1" />
              Customer
            </Button>
            <Link 
              href={user?.role === "ADMIN" ? "/admin/dashboard" : user?.role === "MANAGER" ? "/manager/dashboard" : "/sales/dashboard"}
              className={cn("flex items-center gap-1 px-2 py-1 rounded border text-sm hover:underline", isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-600")}
            >
              <Store className="h-3 w-3" />
              <span>Main</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-emerald-600">
            <Pause className="h-4 w-4 mr-1" />
            Hold
          </Button>
          <div className={cn("h-6 w-px bg-gray-300 dark:bg-gray-700")} />
          <Bell className={cn("h-5 w-5 cursor-pointer", isDark ? "text-gray-500" : "text-gray-400")} />
          <div className="w-8 h-8 rounded-full bg-[#003D9B] dark:bg-[#0066FF] flex items-center justify-center text-white text-xs font-bold">
            {getUserInitial(user?.name)}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 overflow-hidden">
        {/* Products */}
        <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-800">
          {/* Search */}
          <div className={cn("p-3 border-b", isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200")}>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <ProductSearch onSelectProduct={handleSelectProduct} autoFocus />
              </div>
              <Button variant="outline" size="sm" onClick={handleClearCart}>
                <RotateCcw className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                    selectedCategory === cat
                      ? "bg-[#003D9B] dark:bg-[#0066FF] text-white"
                      : isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-auto p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleSelectProduct(product)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className={cn("w-[340px]", isDark ? "bg-gray-900" : "bg-white")}>
          <CartPanel
            items={cartItems as any}
            subtotal={cartSubtotal}
            tax={cartTax}
            total={cartTotal}
            attachedCustomer={attachedCustomer}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onAttachCustomer={() => {}}
            onRemoveCustomer={() => setAttachedCustomer(null)}
            onClearCart={handleClearCart}
            onProceedToPayment={() => setPaymentModalOpen(true)}
            isProcessing={false}
          />
        </div>

        <PaymentModal
          open={isPaymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          total={cartTotal}
          onComplete={handlePaymentComplete}
          isProcessing={false}
        />
      </main>
    </div>
  );
}