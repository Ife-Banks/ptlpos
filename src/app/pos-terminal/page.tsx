"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Pause, UserPlus, Store, Bell, ShoppingCart, Loader2, X, Search, Plus, Minus, Clock, Printer, Receipt, ListChecks, Eye, Undo2, RotateCcwIcon, CreditCard, Package, AlertTriangle, TrendingUp, BarChart3, ClipboardList } from "lucide-react";
import { inventoryApi } from "@/lib/api/inventory";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ProductSearch } from "@/components/pos/product-search";
import { ProductCard } from "@/components/pos/product-card";
import { CartPanel } from "@/components/pos/cart-panel";
import { PaymentModal } from "@/components/pos/payment-modal";
import { CustomerSearchModal } from "@/components/pos/customer-search-modal";
import { HeldSalesModal } from "@/components/pos/held-sales-modal";
import { usePOSStore } from "@/stores/pos-store";
import { useAuthStore } from "@/stores";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/components/providers/theme-provider";
import { cn, formatCurrency } from "@/lib/utils";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { salesApi } from "@/lib/api/sales";
import { shiftsApi } from "@/lib/api/shifts";
import { branchesApi } from "@/lib/api/branches";
import type { Shift } from "@/lib/api/shifts";

interface Branch {
  id: string;
  name: string;
}

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
  const { taxRate, loadSettings } = useSettingsStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [attachedCustomer, setAttachedCustomer] = useState<{ id: string; name: string; phone?: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentSaleId, setCurrentSaleId] = useState<string | null>(null);
  
  // Shift state
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [openingBalance, setOpeningBalance] = useState("");
  const [drawerType, setDrawerType] = useState<"ONLINE" | "OFFLINE" | "MIXED">("OFFLINE");

  // Modals
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showHeldSales, setShowHeldSales] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastCompletedSale, setLastCompletedSale] = useState<{
    id: string;
    total: number;
    paymentMethod: string;
    items: CartItem[];
    customer?: { name: string; phone?: string };
  } | null>(null);
  
  // Sales operations modals
  const [showSalesList, setShowSalesList] = useState(false);
  const [todaySales, setTodaySales] = useState<any[]>([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [showSaleDetails, setShowSaleDetails] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showReturnExchangeModal, setShowReturnExchangeModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundItems, setRefundItems] = useState<{ itemId: string; quantity: number }[]>([]);
  const [returnType, setReturnType] = useState<"RETURN" | "EXCHANGE" | "RETURN_AND_EXCHANGE">("RETURN");
  const [returnItems, setReturnItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [exchangeItems, setExchangeItems] = useState<{ productId: string; quantity: number; price: number }[]>([]);

  // Inventory awareness state
  const [showLowStock, setShowLowStock] = useState(false);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loadingLowStock, setLoadingLowStock] = useState(false);
  const [showProductStock, setShowProductStock] = useState(false);
  const [productStock, setProductStock] = useState<any[]>([]);
  const [loadingProductStock, setLoadingProductStock] = useState(false);

  // End of shift state
  const [showEndOfShift, setShowEndOfShift] = useState(false);
  const [shiftSummary, setShiftSummary] = useState<any>(null);
  const [loadingShiftSummary, setLoadingShiftSummary] = useState(false);
  const [closingBalance, setClosingBalance] = useState("");
  const [closingNotes, setClosingNotes] = useState("");
  const [showDailyPerformance, setShowDailyPerformance] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loadingPerformance, setLoadingPerformance] = useState(false);

  // Profile & Settings
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const isDark = theme === "dark";

  // Fetch products, categories, branches, and check active shift
  useEffect(() => {
    loadSettings();
    const fetchData = async () => {
      setLoadingProducts(true);
      try {
        const [productsRes, categoriesRes, branchesRes, shiftRes] = await Promise.all([
          productsApi.list({ limit: 100 }).catch(() => ({ data: [], meta: { total: 0 } })),
          categoriesApi.list({ limit: 50 }).catch(() => ({ data: [], meta: { total: 0 } })),
          branchesApi.list({ limit: 100 }).catch(() => ({ data: [] })),
          shiftsApi.getActive().catch(() => null),
        ]);

        const productsData = productsRes.data || [];
        const categoriesData = categoriesRes.data || [];
        const branchesData = branchesRes.data || [];

        setProducts(productsData);
        setCategories(categoriesData);
        setBranches(branchesData);

        if (shiftRes && shiftRes.length > 0) {
          setCurrentShift(shiftRes[0]);
          const branch = branchesData.find((b: Branch) => b.id === shiftRes[0].branchId);
          if (branch) setSelectedBranch(branch);
        } else {
          setShowShiftModal(true);
        }
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
  const taxRateDecimal = (taxRate || 7.5) / 100;
  const cartTax = cartSubtotal * taxRateDecimal;
  const cartTotal = cartSubtotal + cartTax;
  const branchOptions = branches as Array<{ id: string; name: string }>;
  const selectedBranchId = (selectedBranch as { id: string } | null)?.id || "";

  // Select product and add to cart
  const handleSelectProduct = useCallback(async (product: Product) => {
    const price = parsePrice(product.price);
    
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const newQty = existing.quantity + 1;
        const newTotal = newQty * price;
        const newTax = newTotal * taxRateDecimal;
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
      const itemTax = itemTotal * taxRateDecimal;
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
          taxRate: taxRate || 7.5,
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
              taxAmount: (quantity * item.price) * taxRateDecimal,
            }
          : item
      );
    });
  }, [taxRateDecimal]);

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
    const taxRateDecimal = (taxRate || 7.5) / 100;
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
      taxRate: item.taxRate || taxRate || 7.5,
      taxAmount: (item.price * item.quantity) * taxRateDecimal,
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

  // Complete payment - now handled by payment modal
  const handlePaymentComplete = useCallback(async (paymentData: { 
    method: string; 
    amount: number; 
    [key: string]: any 
  }) => {
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
      
      // Add payment to the sale
      await salesApi.addPayment(saleId!, {
        method: paymentData.method as "CASH" | "CARD" | "OTHER" | "TRANSFER" | "STORE_CREDIT",
        amount: paymentData.amount,
      });
      
      // Complete the sale
      await salesApi.complete(saleId!, {
        paymentMethod: paymentData.method as "CASH" | "CARD" | "TRANSFER" | "STORE_CREDIT" | "OTHER",
        paidAmount: paymentData.amount,
      });
      
      // Store sale info for receipt
      const saleInfo = {
        id: saleId!,
        total: cartTotal,
        paymentMethod: paymentData.method,
        items: [...cartItems],
        customer: attachedCustomer || undefined,
      };
      setLastCompletedSale(saleInfo);
      
      // Close payment modal and clear cart, then show receipt
      setPaymentModalOpen(false);
      handleClearCart();
      setShowReceipt(true);
      
      // Print receipt (in a real app, this would be done via the print dialog)
      // const receipt = await salesApi.getPrintReceipt(saleId);
      // window.print();
      
    } catch (err) {
      console.error("Failed to complete sale:", err);
    } finally {
      setProcessing(false);
    }
  }, [cartItems, attachedCustomer, cartTotal, currentSaleId, setPaymentModalOpen, handleClearCart]);

  // Shift handlers
  const handleOpenShift = async () => {
    if (!openingBalance) return;
    setProcessing(true);
    try {
      const shift = await shiftsApi.open({
        openingBalance: parseFloat(openingBalance),
        drawerType,
        notes: `Branch: ${selectedBranch?.name || "Unknown"}`,
      });
      setCurrentShift(shift);
      setShowShiftModal(false);
    } catch (err) {
      console.error("Failed to open shift:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleEndShift = async () => {
    if (!confirm("End this shift?")) return;
    setProcessing(true);
    try {
      await shiftsApi.close(currentShift!.id, { closingBalance: 0 });
      setCurrentShift(null);
      setShowShiftModal(true);
    } catch (err) {
      console.error("Failed to end shift:", err);
    } finally {
      setProcessing(false);
    }
  };

  // Sales operations handlers
  const handleViewSales = async () => {
    setShowSalesList(true);
    setLoadingSales(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await salesApi.list({ limit: 50 });
      setTodaySales(result.data.filter((s: any) => 
        s.createdAt && s.createdAt.startsWith(today)
      ));
    } catch (err) {
      console.error("Failed to load sales:", err);
    } finally {
      setLoadingSales(false);
    }
  };

  const handleViewSaleDetails = async (sale: any) => {
    setSelectedSale(sale);
    setShowSaleDetails(true);
  };

  const handleCancelSale = async (saleId: string) => {
    if (!confirm("Are you sure you want to cancel this sale?")) return;
    setProcessing(true);
    try {
      await salesApi.cancel(saleId);
      setShowSaleDetails(false);
      handleViewSales();
    } catch (err) {
      console.error("Failed to cancel sale:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedSale) return;
    setProcessing(true);
    try {
      await salesApi.refund(selectedSale.id, {
        items: refundItems,
        reason: refundReason,
      });
      setShowRefundModal(false);
      setShowSaleDetails(false);
      handleViewSales();
    } catch (err) {
      console.error("Failed to process refund:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessReturnExchange = async () => {
    if (!selectedSale) return;
    setProcessing(true);
    try {
      await salesApi.returnExchange(selectedSale.id, {
        type: returnType,
        returnItems: returnItems,
        exchangeItems: exchangeItems,
      });
      setShowReturnExchangeModal(false);
      setShowSaleDetails(false);
      handleViewSales();
    } catch (err) {
      console.error("Failed to process return/exchange:", err);
    } finally {
      setProcessing(false);
    }
  };

  // Inventory awareness handlers
  const handleViewLowStock = async () => {
    setShowLowStock(true);
    setLoadingLowStock(true);
    try {
      const items = await inventoryApi.getLowStock(10);
      setLowStockItems(items);
    } catch (err) {
      console.error("Failed to load low stock items:", err);
    } finally {
      setLoadingLowStock(false);
    }
  };

  const handleViewProductStock = async () => {
    setShowProductStock(true);
    setLoadingProductStock(true);
    try {
      // Load inventory for current branch
      const result = await inventoryApi.list({ limit: 100 });
      setProductStock(result.data);
    } catch (err) {
      console.error("Failed to load product stock:", err);
    } finally {
      setLoadingProductStock(false);
    }
  };

  const handleAlertManager = () => {
    alert("Please contact your manager about the low stock items. They can view and process restocking from the admin panel.");
  };

  // End of shift handlers
  const handleViewEndOfShift = async () => {
    if (!currentShift) return;
    setShowEndOfShift(true);
    setLoadingShiftSummary(true);
    try {
      const summary = await shiftsApi.endOfShift(currentShift.id);
      setShiftSummary(summary);
    } catch (err) {
      console.error("Failed to load shift summary:", err);
    } finally {
      setLoadingShiftSummary(false);
    }
  };

  const handleCloseShift = async () => {
    if (!currentShift || !closingBalance) return;
    setProcessing(true);
    try {
      await shiftsApi.close(currentShift.id, {
        closingBalance: parseFloat(closingBalance),
        notes: closingNotes,
      });
      setCurrentShift(null);
      setShowEndOfShift(false);
      setShowShiftModal(true);
      setClosingBalance("");
      setClosingNotes("");
    } catch (err) {
      console.error("Failed to close shift:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDailyPerformance = async () => {
    setShowDailyPerformance(true);
    setLoadingPerformance(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const [salesRes, shiftRes] = await Promise.all([
        salesApi.list({ status: "COMPLETED", limit: 100 }),
        currentShift ? shiftsApi.endOfShift(currentShift.id).catch(() => null) : Promise.resolve(null),
      ]);
      
      const todaySales = salesRes.data.filter((s: any) => s.createdAt && s.createdAt.startsWith(today));
      const totalRevenue = todaySales.reduce((sum: number, s: any) => sum + (s.total || 0), 0);
      const cashSales = todaySales.filter((s: any) => s.paymentMethod === "CASH").reduce((sum: number, s: any) => sum + (s.total || 0), 0);
      const cardSales = todaySales.filter((s: any) => s.paymentMethod === "CARD").reduce((sum: number, s: any) => sum + (s.total || 0), 0);
      
      setPerformanceData({
        totalSales: todaySales.length,
        totalRevenue,
        cashSales,
        cardSales,
        shiftSummary: shiftRes,
      });
    } catch (err) {
      console.error("Failed to load performance data:", err);
    } finally {
      setLoadingPerformance(false);
    }
  };

  // Profile handlers
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    setPasswordError("");
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

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
            {currentShift && (
              <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                <Clock className="h-3 w-3 mr-2" /> Shift Active
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShiftModal(true)}
              className={currentShift ? "border-red-200 text-red-600 hover:bg-red-50" : "border-amber-200 text-amber-600 hover:bg-amber-50"}
            >
              <Clock className="h-4 w-4 mr-2" />
              {currentShift ? "End Shift" : "Start Shift"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomerSearch(true)}
              className={isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-200 text-gray-600 hover:bg-gray-100"}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Customer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewSales}
              className={isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-200 text-gray-600 hover:bg-gray-100"}
            >
              <ListChecks className="h-4 w-4 mr-2" />
              Sales
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
          <button
            onClick={() => setShowProfile(true)}
            className="w-8 h-8 rounded-full bg-[#003D9B] dark:bg-[#0066FF] flex items-center justify-center text-white text-xs font-bold hover:opacity-90"
          >
            {getUserInitial(user?.name)}
          </button>
        </div>
      </header>

      {/* Shift Status Banner */}
      {!currentShift && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
          <div className="flex flex-col items-center gap-2">
            <p className="text-amber-800 dark:text-amber-200 font-medium">No Active Shift</p>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Start a shift to begin processing sales
            </p>
          </div>
        </div>
      )}
      {currentShift && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">Shift Active</p>
              <div className="flex flex-wrap gap-3 text-sm text-emerald-600 dark:text-emerald-400">
                <span>{currentShift.drawerType}</span>
                <span>•</span>
                <span>Opening: {formatCurrency(currentShift.openingBalance)}</span>
                {selectedBranch && (
                  <>
                    <span>•</span>
                    <span>{selectedBranch.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {currentShift && (
            <>
              <Button variant="outline" onClick={handleViewLowStock} className="border-amber-200 text-amber-600 hover:bg-amber-50 px-3 py-1.5 text-sm">
                <Package className="h-4 w-4 mr-1" />
                Stock
              </Button>
              <Button variant="outline" onClick={handleViewDailyPerformance} className="border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Performance
              </Button>
              <Button variant="outline" onClick={handleViewEndOfShift} className="border-red-200 text-red-600 hover:bg-red-50 px-4 py-2">
                End Shift
              </Button>
            </>
          )}
        </div>
      )}

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
          onClose={() => {
            setPaymentModalOpen(false);
            handleClearCart();
          }}
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

        {/* Shift Modal */}
        <Dialog open={showShiftModal} onOpenChange={setShowShiftModal}>
          <DialogContent className="sm:max-w-4xl bg-white dark:bg-gray-900">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold">{currentShift ? "End Shift" : "Start Shift"}</DialogTitle>
            </DialogHeader>
            {currentShift ? (
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-300 font-medium flex items-center gap-2">
                    <X className="h-4 w-4" /> Are you sure you want to end your current shift?
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    All sales will be finalized and the shift will be closed.
                  </p>
                </div>
                <DialogFooter className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowShiftModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleEndShift} disabled={processing} className="whitespace-nowrap">
                    {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    End Shift
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="space-y-6">
                {!selectedBranch && branches.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Branch</label>
                    <select
                      className="block w-full h-10 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#003D9B] focus:ring-[#003D9B] focus:ring-opacity-50 dark:focus:ring-opacity-20"
                      value={selectedBranchId}
                      onChange={(e) => {
                        const branch = branchOptions.find((br) => br.id === e.target.value);
                        setSelectedBranch(branch || null);
                      }}
                    >
                      <option value="">Select branch</option>
                      {branchOptions.map((branch) => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Opening Balance</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      $
                    </div>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={openingBalance}
                      onChange={(e) => setOpeningBalance(e.target.value)}
                      className="pl-8 pr-3"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Drawer Type</label>
                  <select
                    className="block w-full h-10 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:border-[#003D9B] focus:ring-[#003D9B] focus:ring-opacity-50 dark:focus:ring-opacity-20"
                    value={drawerType}
                    onChange={(e) => setDrawerType(e.target.value as "ONLINE" | "OFFLINE" | "MIXED")}
                  >
                    <option value="OFFLINE">Offline</option>
                    <option value="ONLINE">Online</option>
                    <option value="MIXED">Mixed</option>
                  </select>
                </div>
                <div className="mt-6">
                  <DialogFooter className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setShowShiftModal(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleOpenShift} 
                      disabled={processing || (!selectedBranch && branches.length > 0)}
                      className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white whitespace-nowrap"
                    >
                      {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Start Shift
                    </Button>
                  </DialogFooter>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Receipt Modal */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-center">
              <div className={cn(
                "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4",
                isDark ? "bg-emerald-500/20" : "bg-emerald-100"
              )}>
                <Receipt className={cn("h-8 w-8", isDark ? "text-emerald-400" : "text-emerald-600")} />
              </div>
              <DialogTitle className="text-xl font-bold">Payment Successful</DialogTitle>
            </DialogHeader>
            {lastCompletedSale && (
              <div className={cn("space-y-4", isDark ? "text-gray-300" : "text-gray-600")}>
                <div className={cn(
                  "text-center p-4 rounded-lg",
                  isDark ? "bg-gray-800" : "bg-gray-50"
                )}>
                  <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                    {formatCurrency(lastCompletedSale.total)}
                  </p>
                  <p className="text-sm">Total Amount</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sale ID:</span>
                    <span className="font-mono">{lastCompletedSale.id.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium">{lastCompletedSale.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{lastCompletedSale.items.length} items</span>
                  </div>
                  {lastCompletedSale.customer && (
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span>{lastCompletedSale.customer.name}</span>
                    </div>
                  )}
                </div>

                <div className={cn(
                  "border-t pt-4",
                  isDark ? "border-gray-700" : "border-gray-200"
                )}>
                  <p className="text-xs text-center mb-4">Items Purchased</p>
                  <div className={cn("max-h-32 overflow-y-auto text-sm", isDark ? "bg-gray-800" : "bg-gray-50")}>
                    {lastCompletedSale.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1 px-2">
                        <span className="truncate flex-1">{item.product?.name || 'Product'} x{item.quantity}</span>
                        <span className="font-medium">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowReceipt(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  window.print();
                }}
                className="flex-1 bg-[#003D9B] hover:bg-[#003D9B]/90 text-white"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Today's Sales List Modal */}
        <Dialog open={showSalesList} onOpenChange={setShowSalesList}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Today's Sales</DialogTitle>
            </DialogHeader>
            {loadingSales ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#003D9B]" />
              </div>
            ) : todaySales.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No sales today</p>
              </div>
            ) : (
              <div className={cn("max-h-96 overflow-y-auto", isDark ? "bg-gray-800" : "bg-gray-50")}>
                {todaySales.map((sale) => (
                  <div
                    key={sale.id}
                    onClick={() => handleViewSaleDetails(sale)}
                    className={cn(
                      "flex items-center justify-between p-3 cursor-pointer hover:opacity-80",
                      isDark ? "border-b border-gray-700" : "border-b border-gray-200"
                    )}
                  >
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                        {sale.saleNumber || sale.id.slice(-8)}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                        {sale.items?.length || 0} items
                        {sale.customer && ` • ${sale.customer.name}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-bold", isDark ? "text-white" : "text-gray-900")}>
                        {formatCurrency(sale.total)}
                      </p>
                      <Badge className={cn(
                        "text-xs",
                        sale.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                        sale.status === "HELD" ? "bg-amber-100 text-amber-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Sale Details Modal */}
        <Dialog open={showSaleDetails} onOpenChange={setShowSaleDetails}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Sale Details</DialogTitle>
            </DialogHeader>
            {selectedSale && (
              <div className="space-y-4">
                <div className={cn(
                  "grid grid-cols-2 gap-4 p-4 rounded-lg",
                  isDark ? "bg-gray-800" : "bg-gray-50"
                )}>
                  <div>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Sale ID</p>
                    <p className={cn("font-mono font-medium", isDark ? "text-white" : "text-gray-900")}>
                      {selectedSale.saleNumber || selectedSale.id.slice(-8)}
                    </p>
                  </div>
                  <div>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Status</p>
                    <Badge className={cn(
                      selectedSale.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                      selectedSale.status === "HELD" ? "bg-amber-100 text-amber-700" :
                      selectedSale.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {selectedSale.status}
                    </Badge>
                  </div>
                  <div>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Customer</p>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                      {selectedSale.customer?.name || "Walk-in"}
                    </p>
                  </div>
                  <div>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Payment</p>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                      {selectedSale.paymentMethod || selectedSale.payments?.[0]?.method || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className={cn("text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>Items</p>
                  <div className={cn("rounded-lg overflow-hidden", isDark ? "bg-gray-800" : "bg-gray-50")}>
                    {selectedSale.items?.map((item: any, idx: number) => (
                      <div key={idx} className={cn(
                        "flex justify-between p-3",
                        isDark ? "border-b border-gray-700" : "border-b border-gray-200"
                      )}>
                        <div className="flex-1">
                          <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                            {item.product?.name || "Product"}
                          </p>
                          <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                            {formatCurrency(item.price)} x {item.quantity}
                          </p>
                        </div>
                        <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                          {formatCurrency(item.total)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cn(
                  "flex justify-between text-lg font-bold pt-4 border-t",
                  isDark ? "border-gray-700" : "border-gray-200"
                )}>
                  <span>Total</span>
                  <span className="text-[#003D9B]">{formatCurrency(selectedSale.total)}</span>
                </div>

                {selectedSale.status === "COMPLETED" && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowRefundModal(true)}
                      className="flex-1"
                    >
                      <Undo2 className="h-4 w-4 mr-2" />
                      Refund
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowReturnExchangeModal(true)}
                      className="flex-1"
                    >
                      <RotateCcwIcon className="h-4 w-4 mr-2" />
                      Return/Exchange
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelSale(selectedSale.id)}
                      className="flex-1"
                    >
                      Cancel Sale
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Refund Modal */}
        <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Process Refund</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                Process a refund for this sale. Select items and specify the reason.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium">Refund Reason</label>
                <Input
                  placeholder="e.g., Customer request, defective item"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRefundModal(false)}>Cancel</Button>
                <Button 
                  onClick={handleProcessRefund}
                  disabled={processing || !refundReason}
                  className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white"
                >
                  {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Process Refund
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Return/Exchange Modal */}
        <Dialog open={showReturnExchangeModal} onOpenChange={setShowReturnExchangeModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Return/Exchange</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3"
                  value={returnType}
                  onChange={(e) => setReturnType(e.target.value as "RETURN" | "EXCHANGE" | "RETURN_AND_EXCHANGE")}
                >
                  <option value="RETURN">Return Only</option>
                  <option value="EXCHANGE">Exchange Only</option>
                  <option value="RETURN_AND_EXCHANGE">Return & Exchange</option>
                </select>
              </div>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                Process a return or exchange for this sale. The system will handle the payment adjustments.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowReturnExchangeModal(false)}>Cancel</Button>
                <Button 
                  onClick={handleProcessReturnExchange}
                  disabled={processing}
                  className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white"
                >
                  {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Process Return/Exchange
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Low Stock Alert Modal */}
        <Dialog open={showLowStock} onOpenChange={setShowLowStock}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Low Stock Alerts
              </DialogTitle>
            </DialogHeader>
            {loadingLowStock ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#003D9B]" />
              </div>
            ) : lowStockItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className={cn("h-12 w-12 mx-auto mb-3", isDark ? "text-emerald-500" : "text-emerald-500")} />
                <p className={isDark ? "text-gray-400" : "text-gray-500"}>No low stock items</p>
              </div>
            ) : (
              <div className={cn("max-h-96 overflow-y-auto", isDark ? "bg-gray-800" : "bg-gray-50")}>
                {lowStockItems.map((item: any) => (
                  <div key={item.id} className={cn(
                    "flex items-center justify-between p-3",
                    isDark ? "border-b border-gray-700" : "border-b border-gray-200"
                  )}>
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                        {item.product?.name || "Product"}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                        SKU: {item.product?.sku || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-bold", item.quantity <= 5 ? "text-red-500" : "text-amber-500")}>
                        {item.quantity} left
                      </p>
                      <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>
                        Threshold: {item.lowStockThreshold}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLowStock(false)}>Close</Button>
              <Button onClick={handleAlertManager} className="bg-amber-500 hover:bg-amber-600 text-white">
                Alert Manager
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Product Stock Modal */}
        <Dialog open={showProductStock} onOpenChange={setShowProductStock}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Product Stock Levels</DialogTitle>
            </DialogHeader>
            {loadingProductStock ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#003D9B]" />
              </div>
            ) : (
              <div className={cn("max-h-96 overflow-y-auto", isDark ? "bg-gray-800" : "bg-gray-50")}>
                {productStock.map((item: any) => (
                  <div key={item.id} className={cn(
                    "flex items-center justify-between p-3",
                    isDark ? "border-b border-gray-700" : "border-b border-gray-200"
                  )}>
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                        {item.product?.name || "Product"}
                      </p>
                      <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                        {item.branch?.name || "Branch"}
                      </p>
                    </div>
                    <Badge className={cn(
                      item.quantity > 20 ? "bg-emerald-100 text-emerald-700" :
                      item.quantity > 5 ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {item.quantity} in stock
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProductStock(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* End of Shift Modal */}
        <Dialog open={showEndOfShift} onOpenChange={setShowEndOfShift}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-emerald-500" />
                End of Shift Summary
              </DialogTitle>
            </DialogHeader>
            {loadingShiftSummary ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#003D9B]" />
              </div>
            ) : shiftSummary ? (
              <div className="space-y-4">
                <div className={cn(
                  "grid grid-cols-2 gap-4 p-4 rounded-lg",
                  isDark ? "bg-gray-800" : "bg-gray-50"
                )}>
                  <div>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Opening Balance</p>
                    <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                      {formatCurrency(shiftSummary.shift?.openingBalance || 0)}
                    </p>
                  </div>
                  <div>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Total Sales</p>
                    <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                      {shiftSummary.sales?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Cash Sales</p>
                    <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                      {formatCurrency(shiftSummary.payments?.CASH || 0)}
                    </p>
                  </div>
                  <div>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Card Sales</p>
                    <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                      {formatCurrency(shiftSummary.payments?.CARD || 0)}
                    </p>
                  </div>
                </div>

                {shiftSummary.reconciliation && (
                  <div className={cn(
                    "p-4 rounded-lg",
                    isDark ? "bg-gray-800" : "bg-gray-50"
                  )}>
                    <p className={cn("text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
                      Cash Reconciliation
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className={isDark ? "text-gray-400" : "text-gray-500"}>Expected Cash:</span>
                        <span className={isDark ? "text-white" : "text-gray-900"}>
                          {formatCurrency(shiftSummary.reconciliation.expectedCash)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? "text-gray-400" : "text-gray-500"}>Actual Cash:</span>
                        <span className={isDark ? "text-white" : "text-gray-900"}>
                          {formatCurrency(shiftSummary.reconciliation.actualCash)}
                        </span>
                      </div>
                      <div className={cn(
                        "flex justify-between font-bold pt-2 border-t",
                        isDark ? "border-gray-700" : "border-gray-200"
                      )}>
                        <span>Discrepancy:</span>
                        <span className={shiftSummary.reconciliation.discrepancy === 0 ? "text-emerald-500" : "text-red-500"}>
                          {formatCurrency(shiftSummary.reconciliation.discrepancy)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Closing Balance (Cash Count)</label>
                    <div className="relative mt-1">
                      <span className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 text-lg",
                        isDark ? "text-gray-500" : "text-gray-400"
                      )}>$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={closingBalance}
                        onChange={(e) => setClosingBalance(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <Input
                      placeholder="Any notes for this shift..."
                      value={closingNotes}
                      onChange={(e) => setClosingNotes(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEndOfShift(false)}>Cancel</Button>
                  <Button 
                    onClick={handleCloseShift}
                    disabled={!closingBalance || processing}
                    className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white"
                  >
                    {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Close Shift
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className={isDark ? "text-gray-400" : "text-gray-500"}>No shift data available</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Daily Performance Modal */}
        <Dialog open={showDailyPerformance} onOpenChange={setShowDailyPerformance}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Daily Performance
              </DialogTitle>
            </DialogHeader>
            {loadingPerformance ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#003D9B]" />
              </div>
            ) : performanceData ? (
              <div className="space-y-4">
                <div className={cn(
                  "grid grid-cols-2 gap-4 p-4 rounded-lg",
                  isDark ? "bg-gray-800" : "bg-gray-50"
                )}>
                  <div className="text-center">
                    <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                      {performanceData.totalSales}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Total Sales</p>
                  </div>
                  <div className="text-center">
                    <p className={cn("text-3xl font-bold text-emerald-500")}>
                      {formatCurrency(performanceData.totalRevenue)}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                      {formatCurrency(performanceData.cashSales)}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Cash Sales</p>
                  </div>
                  <div className="text-center">
                    <p className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                      {formatCurrency(performanceData.cardSales)}
                    </p>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Card Sales</p>
                  </div>
                </div>

                {performanceData.shiftSummary?.reconciliation && (
                  <div className={cn(
                    "p-4 rounded-lg",
                    isDark ? "bg-gray-800" : "bg-gray-50"
                  )}>
                    <p className={cn("text-sm font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
                      Shift Summary
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className={isDark ? "text-gray-400" : "text-gray-500"}>Opening:</span>
                        <span className={isDark ? "text-white" : "text-gray-900"}>
                          {formatCurrency(performanceData.shiftSummary.shift?.openingBalance || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? "text-gray-400" : "text-gray-500"}>Expected Cash:</span>
                        <span className={isDark ? "text-white" : "text-gray-900"}>
                          {formatCurrency(performanceData.shiftSummary.reconciliation.expectedCash)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? "text-gray-400" : "text-gray-500"}>Discrepancy:</span>
                        <span className={performanceData.shiftSummary.reconciliation.discrepancy === 0 ? "text-emerald-500" : "text-amber-500"}>
                          {formatCurrency(performanceData.shiftSummary.reconciliation.discrepancy)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className={cn("h-12 w-12 mx-auto mb-3 opacity-50", isDark ? "text-gray-500" : "text-gray-400")} />
                <p className={isDark ? "text-gray-400" : "text-gray-500"}>No performance data available</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDailyPerformance(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Profile Modal */}
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">My Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className={cn(
                "flex items-center gap-4 p-4 rounded-lg",
                isDark ? "bg-gray-800" : "bg-gray-50"
              )}>
                <div className="w-16 h-16 rounded-full bg-[#003D9B] dark:bg-[#0066FF] flex items-center justify-center text-white text-2xl font-bold">
                  {getUserInitial(user?.name)}
                </div>
                <div>
                  <p className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                    {user?.name || "User"}
                  </p>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    {user?.email || "No email"}
                  </p>
                  <Badge className="mt-1 bg-[#003D9B] text-white">
                    {user?.role || "Sales Rep"}
                  </Badge>
                </div>
              </div>

              <div className={cn(
                "grid grid-cols-2 gap-4 p-4 rounded-lg text-sm",
                isDark ? "bg-gray-800" : "bg-gray-50"
              )}>
                <div>
                  <p className={isDark ? "text-gray-400" : "text-gray-500"}>Tenant</p>
                  <p className={isDark ? "text-white" : "text-gray-900"}>{user?.tenant?.name || "N/A"}</p>
                </div>
                <div>
                  <p className={isDark ? "text-gray-400" : "text-gray-500"}>ID</p>
                  <p className={isDark ? "text-white" : "text-gray-900"}>{user?.id?.slice(-8) || "N/A"}</p>
                </div>
              </div>

              <Button
                onClick={() => setShowChangePassword(true)}
                variant="outline"
                className="w-full"
              >
                Change Password
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProfile(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Password Modal */}
        <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Change Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {passwordSuccess ? (
                <div className={cn(
                  "p-4 rounded-lg text-center",
                  isDark ? "bg-emerald-900/20" : "bg-emerald-50"
                )}>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">Password changed successfully!</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium">Current Password</label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1"
                      placeholder="Confirm new password"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowChangePassword(false);
                setPasswordError("");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}>
                Cancel
              </Button>
              {!passwordSuccess && (
                <Button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="bg-[#003D9B] hover:bg-[#003D9B]/90 text-white"
                >
                  {changingPassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Change Password
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
