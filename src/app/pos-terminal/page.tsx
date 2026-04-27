"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Pause, UserPlus, Store, Bell, ShoppingCart, Loader2, X, Search, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductSearch } from "@/components/pos/product-search";
import { ProductCard } from "@/components/pos/product-card";
import { CartPanel } from "@/components/pos/cart-panel";
import { PaymentModal } from "@/components/pos/payment-modal";
import { CustomerSearchModal } from "@/components/pos/customer-search-modal";
import { HeldSalesModal } from "@/components/pos/held-sales-modal";
import { usePOSStore } from "@/stores/pos-store";
import { useAuthStore } from "@/stores";
import { useTheme } from "@/components/providers/theme-provider";
import { cn, formatCurrency } from "@/lib/utils";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { salesApi } from "@/lib/api/sales";

function parsePrice(price: number | string | { amount?: number } | undefined | null): number {
  if (price === undefined || price === null) return 0;
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price) || 0;
  if (typeof price === 'object' && price !== null) return price.amount || 0;
  return 0;
}

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

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category?: string;
  categoryId?: string;
  stock?: number;
  imageUrl?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function POSTerminalPage() {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const { isPaymentModalOpen, setPaymentModalOpen } = usePOSStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [attachedCustomer, setAttachedCustomer] = useState<{ id: string; name: string; phone?: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentSaleId, setCurrentSaleId] = useState<string | null>(null);
  
  // Modals
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showHeldSales, setShowHeldSales] = useState(false);

  const isDark = theme === "dark";

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoadingProducts(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.list({ limit: 100 }).catch(() => ({ data: [], meta: { total: 0 } })),
          categoriesApi.list({ limit: 50 }).catch(() => ({ data: [], meta: { total: 0 } })),
        ]);
        
        const productsData = productsRes.data || [];
        const categoriesData = categoriesRes.data || [];
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load POS data:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchData();
  }, []);

  // Filter products by category
  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "All") return true;
    const catName = typeof product.category === 'string' ? product.category : (product.category as any)?.name;
    return catName === selectedCategory || product.categoryId === selectedCategory;
  });

  // Calculate cart totals
  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.total || 0), 0);
  const cartTax = cartItems.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
  const cartTotal = cartSubtotal + cartTax;

  // Select product and add to cart
  const handleSelectProduct = useCallback(async (product: Product) => {
    const price = parsePrice(product.price);
    
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const newQty = existing.quantity + 1;
        const newTotal = newQty * price;
        const newTax = newTotal * 0.075;
        const updated = prev.map((item) =>
          item.productId === product.id
            ? { 
                ...item, 
                quantity: newQty,
                total: newTotal,
                taxAmount: newTax,
              }
            : item
        );
        return updated;
      }
      const itemTotal = price;
      const itemTax = itemTotal * 0.075;
      return [
        ...prev,
        {
          id: `temp-${Date.now()}-${product.id}`,
          productId: product.id,
          product: { id: product.id, name: product.name, price, sku: product.sku || "" },
          quantity: 1,
          price,
          total: itemTotal,
          saleId: currentSaleId || "",
          unitPrice: price,
          discount: 0,
          taxRate: 7.5,
          taxAmount: itemTax,
        },
      ];
    });
  }, [currentSaleId]);

  // Update quantity
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

  // Remove item
  const handleRemoveItem = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  // Clear cart
  const handleClearCart = useCallback(() => {
    setCartItems([]);
    setAttachedCustomer(null);
    setCurrentSaleId(null);
  }, []);

  // Attach customer
  const handleAttachCustomer = (customer: { id: string; name: string; phone?: string }) => {
    setAttachedCustomer(customer);
    setShowCustomerSearch(false);
  };

  // Hold sale
  const handleHoldSale = useCallback(async () => {
    if (cartItems.length === 0) return;
    
    setProcessing(true);
    try {
      const sale = await salesApi.create({
        customerId: attachedCustomer?.id,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
      });
      
      await salesApi.hold(sale.id);
      handleClearCart();
      setShowHeldSales(true);
    } catch (err) {
      console.error("Failed to hold sale:", err);
    } finally {
      setProcessing(false);
    }
  }, [cartItems, attachedCustomer, handleClearCart]);

  // Resume held sale
  const handleResumeSale = useCallback((sale: any) => {
    const items: CartItem[] = sale.items.map((item: any) => ({
      id: `temp-${Date.now()}-${item.productId}`,
      productId: item.productId,
      product: {
        id: item.productId,
        name: item.product?.name || "Product",
        price: item.price,
        sku: item.product?.sku || "",
      },
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      saleId: sale.id,
      unitPrice: item.price,
      discount: item.discount || 0,
      taxRate: item.taxRate || 7.5,
      taxAmount: (item.price * item.quantity) * ((item.taxRate || 7.5) / 100),
    }));
    
    setCartItems(items);
    setCurrentSaleId(sale.id);
    if (sale.customer) {
      setAttachedCustomer({
        id: sale.customer.id,
        name: sale.customer.name,
        phone: sale.customer.phone,
      });
    }
    setShowHeldSales(false);
  }, []);

  // Complete payment
  const handlePaymentComplete = useCallback(async () => {
    if (cartItems.length === 0) return;
    
    setProcessing(true);
    try {
      let saleId = currentSaleId;
      
      if (!saleId) {
        const sale = await salesApi.create({
          customerId: attachedCustomer?.id,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
        });
        saleId = sale.id;
      }
      
      await salesApi.complete(saleId!, {
        paymentMethod: "CASH",
        paidAmount: cartTotal,
      });
      
      setPaymentModalOpen(false);
      handleClearCart();
    } catch (err) {
      console.error("Failed to complete sale:", err);
    } finally {
      setProcessing(false);
    }
  }, [cartItems, attachedCustomer, cartTotal, currentSaleId, setPaymentModalOpen, handleClearCart]);

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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCustomerSearch(true)}
              className={isDark ? "text-gray-300" : "text-gray-600"}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Customer
            </Button>
            <Link 
              href={["ADMIN", "BILLING_ADMIN"].includes(user?.role || "") ? "/admin/dashboard" : ["MANAGER", "SUPPORT_ADMIN"].includes(user?.role || "") ? "/manager/dashboard" : "/sales/dashboard"}
              className={cn("flex items-center gap-1 px-2 py-1 rounded border text-sm hover:underline", isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-600")}
            >
              <Store className="h-3 w-3" />
              <span>Main</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowHeldSales(true)}
            className="text-emerald-600"
          >
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
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory("All")}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                  selectedCategory === "All"
                    ? "bg-[#003D9B] dark:bg-[#0066FF] text-white"
                    : isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                    selectedCategory === cat.name
                      ? "bg-[#003D9B] dark:bg-[#0066FF] text-white"
                      : isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-auto p-3">
            {loadingProducts ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-[#003D9B]" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm text-gray-400 mt-1">Add products in the admin panel</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleSelectProduct(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className={cn("w-[340px]", isDark ? "bg-gray-900" : "bg-white")}>
          <CartPanel
            items={cartItems}
            subtotal={cartSubtotal}
            tax={cartTax}
            total={cartTotal}
            attachedCustomer={attachedCustomer}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onAttachCustomer={() => setShowCustomerSearch(true)}
            onRemoveCustomer={() => setAttachedCustomer(null)}
            onClearCart={handleClearCart}
            onProceedToPayment={() => setPaymentModalOpen(true)}
            onHold={handleHoldSale}
            isProcessing={processing}
          />
        </div>

        {/* Payment Modal */}
        <PaymentModal
          open={isPaymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          total={cartTotal}
          onComplete={handlePaymentComplete}
          isProcessing={processing}
        />

        {/* Customer Search Modal */}
        <CustomerSearchModal
          open={showCustomerSearch}
          onClose={() => setShowCustomerSearch(false)}
          onSelectCustomer={handleAttachCustomer}
        />

        {/* Held Sales Modal */}
        <HeldSalesModal
          open={showHeldSales}
          onClose={() => setShowHeldSales(false)}
          onResumeSale={handleResumeSale}
        />
      </main>
    </div>
  );
}