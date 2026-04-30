"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { productsApi } from "@/lib/api/products";
import { customersApi } from "@/lib/api/customers";
import { shiftsApi } from "@/lib/api/shifts";
import { salesApi } from "@/lib/api/sales";
import { branchesApi } from "@/lib/api/branches";
import { useAuthStore } from "@/stores";
import { ShoppingCart, Search, User, Plus, Minus, X, Trash2, CreditCard, Banknote, Receipt, Printer, Loader2, Clock, Package, Users, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  sku?: string;
  barcode?: string;
  stock?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  phone?: string;
}

interface Branch {
  id: string;
  name: string;
}

interface Shift {
  id: string;
  status: "OPEN" | "CLOSED";
  openingBalance: number;
  drawerType: "ONLINE" | "OFFLINE" | "MIXED";
}

export default function POSTerminalPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD">("CASH");
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);
  const [openingBalance, setOpeningBalance] = useState("");
  const [drawerType, setDrawerType] = useState<"ONLINE" | "OFFLINE" | "MIXED">("OFFLINE");

  useEffect(() => { initializePOS(); }, []);
  useEffect(() => {
    const filtered = searchQuery
      ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode?.includes(searchQuery))
      : products;
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const initializePOS = async () => {
    setLoading(true);
    try {
      const [branchesRes, shiftRes] = await Promise.all([branchesApi.list({ limit: 100 }), shiftsApi.getActive().catch(() => [])]);
      setBranches(branchesRes.data || []);
      if (shiftRes && shiftRes.length > 0) { setCurrentShift(shiftRes[0]); const branch = (branchesRes.data || []).find((b: Branch) => b.id === shiftRes[0].branchId); if (branch) setSelectedBranch(branch); }
      else setShowShiftModal(true);
      const productsRes = await productsApi.list({ limit: 500 });
      setProducts(productsRes.data || []);
    } catch (err) { console.error("Failed to initialize POS:", err); } finally { setLoading(false); }
  };

  const handleOpenShift = async () => {
    if (!openingBalance) return;
    setProcessing(true);
    try { const shift = await shiftsApi.open({ openingBalance: parseFloat(openingBalance), drawerType, notes: `Branch: ${selectedBranch?.name || "Unknown"}` }); setCurrentShift(shift); setShowShiftModal(false); } 
    catch (err) { console.error("Failed to open shift:", err); } finally { setProcessing(false); }
  };

  const handleEndShift = async () => {
    if (!confirm("End this shift?")) return;
    setProcessing(true);
    try { await shiftsApi.close(currentShift!.id, { closingBalance: 0 }); setCurrentShift(null); setShowShiftModal(true); }
    catch (err) { console.error("Failed to end shift:", err); } finally { setProcessing(false); }
  };

  const addToCart = (product: Product) => {
    setCart(prev => { const existing = prev.find(item => item.product.id === product.id); if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item); return [...prev, { product, quantity: 1 }]; });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => { if (item.product.id === productId) { const newQty = item.quantity + delta; return newQty > 0 ? { ...item, quantity: newQty } : item; } return item; }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.product.id !== productId));
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const branchOptions = branches as Array<{ id: string; name: string }>;
  const selectedBranchId = (selectedBranch as { id: string } | null)?.id || "";

  const handleCheckout = async () => {
    if (cart. length === 0) return;
    setProcessing(true);
    try {
      const sale = await salesApi.create({ customerId: selectedCustomer?.id, branchId: selectedBranch?.id, items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity, price: item.product.price })) });
        await salesApi.complete(sale.id, {
          paymentMethod,
          paidAmount: cartTotal,
        });
      setLastSale(sale); setShowReceiptModal(true); clearCart(); setSelectedCustomer(null);
    } catch (err) { console.error("Failed to process sale:", err); } finally { setProcessing(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900"><Loader2 className="h-8 w-8 animate-spin text-[#003D9B]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">POS Terminal</h1>
              {currentShift && <Badge className="bg-emerald-100 text-emerald-700"><Clock className="h-3 w-3 mr-1" /> Shift Active</Badge>}
              {selectedBranch && <Badge variant="outline">{selectedBranch.name}</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { setShowCustomerModal(true); }} className="border-amber-200"><Users className="h-4 w-4 mr-1" />{selectedCustomer ? selectedCustomer.name : "Add Customer"}</Button>
              <Link href="/profile"><Button variant="outline" size="sm"><UserCircle className="h-4 w-4 mr-1" />{user?.name?.split(" ")[0] || "Profile"}</Button></Link>
            </div>
          </header>

          {currentShift ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 mx-4 mt-4 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center"><Clock className="h-5 w-5 text-white" /></div>
                  <div><p className="font-semibold text-emerald-700 dark:text-emerald-300">Shift Active</p><p className="text-sm text-emerald-600 dark:text-emerald-400">{drawerType}</p></div>
                </div>
                <Button variant="outline" onClick={() => setShowShiftModal(true)} className="border-red-200 text-red-600 hover:bg-red-50">End Shift</Button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 mx-4 mt-4 p-4 rounded-lg text-center">
              <p className="text-amber-700 dark:text-amber-300 font-medium mb-2">No Active Shift</p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">Start a shift to begin processing sales</p>
              <Button onClick={() => setShowShiftModal(true)} className="bg-[#003D9B] text-white"><Clock className="h-4 w-4 mr-2" />Start Shift</Button>
            </div>
          )}

          <div className="p-4"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-white dark:bg-gray-800" /></div></div>
          <div className="flex-1 overflow-y-auto px-4 pb-4"><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map(product => <button key={product.id} onClick={() => addToCart(product)} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-left hover:border-[#003D9B] transition-colors">
              <div className="w-full h-20 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center"><Package className="h-8 w-8 text-gray-400" /></div>
              <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{product.name}</p>
              <p className="text-lg font-bold text-[#003D9B]">${product.price.toFixed(2)}</p>
            </button>)}
          </div></div>
        </div>

        <div className="w-[400px] min-w-[350px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col max-h-[calc(100vh-8rem)]">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Cart ({cart.length})</h2>{cart.length > 0 && <Button variant="ghost" size="sm" onClick={clearCart}><Trash2 className="h-4 w-4" /></Button>}</div></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? <p className="text-center text-gray-500 py-8">Cart is empty</p> : cart.map(item => <div key={item.product.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex-1 min-w-0"><p className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.product.name}</p><p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p></div>
              <div className="flex items-center gap-1 shrink-0"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, -1)}><Minus className="h-4 w-4" /></Button><span className="w-10 text-center font-medium">{item.quantity}</span><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, 1)}><Plus className="h-4 w-4" /></Button></div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 shrink-0" onClick={() => removeFromCart(item.product.id)}><X className="h-4 w-4" /></Button>
            </div>)}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4 shrink-0">
            <div className="flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white"><span>Total</span><span className="text-xl">${cartTotal.toFixed(2)}</span></div>
            {selectedCustomer && <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Customer</span><Badge variant="outline" className="max-w-[150px] truncate">{selectedCustomer.name}</Badge></div>}
            <div className="flex gap-2">
              <Button variant={paymentMethod === "CASH" ? "default" : "outline"} size="sm" className={cn("flex-1", paymentMethod === "CASH" ? "bg-[#003D9B]" : "")} onClick={() => setPaymentMethod("CASH")}><Banknote className="h-4 w-4 mr-1" />Cash</Button>
              <Button variant={paymentMethod === "CARD" ? "default" : "outline"} size="sm" className={cn("flex-1", paymentMethod === "CARD" ? "bg-[#003D9B]" : "")} onClick={() => setPaymentMethod("CARD")}><CreditCard className="h-4 w-4 mr-1" />Card</Button>
            </div>
            <Button className="w-full bg-[#003D9B] hover:bg-[#003D9B]/90 text-white" disabled={cart.length === 0 || processing || !currentShift} onClick={handleCheckout}>{processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CreditCard className="h-4 w-4 mr-2" />}Checkout ${cartTotal.toFixed(2)}</Button>
          </div>
        </div>
      </div>

      <Dialog open={showShiftModal} onOpenChange={setShowShiftModal}><DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{currentShift ? "End Shift" : "Start Shift"}</DialogTitle></DialogHeader>
        {currentShift ? <div className="space-y-4"><p className="text-gray-500">End your current shift?</p><DialogFooter><Button variant="outline" onClick={() => setShowShiftModal(false)}>Cancel</Button><Button variant="destructive" onClick={handleEndShift} disabled={processing}>{processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}End Shift</Button></DialogFooter></div> : <div className="space-y-4">
          {!selectedBranch && branchOptions.length > 0 && <div className="space-y-2"><label className="text-sm font-medium">Branch</label><select className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3" value={selectedBranchId} onChange={(e) => { const branch = branchOptions.find((br) => br.id === e.target.value); setSelectedBranch(branch || null); }}><option value="">Select branch</option>{branchOptions.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></div>}
          <div className="space-y-2"><label className="text-sm font-medium">Opening Balance</label><Input type="number" placeholder="0.00" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Drawer Type</label><select className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3" value={drawerType} onChange={(e) => setDrawerType(e.target.value as any)}><option value="OFFLINE">Offline</option><option value="ONLINE">Online</option><option value="MIXED">Mixed</option></select></div>
          <DialogFooter><Button variant="outline" onClick={() => setShowShiftModal(false)}>Cancel</Button><Button onClick={handleOpenShift} disabled={processing || (!selectedBranch && branches.length > 0)}>{processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Start Shift</Button></DialogFooter>
        </div>}
      </DialogContent></Dialog>

      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}><DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Select Customer</DialogTitle></DialogHeader>
        <div className="space-y-4"><Input placeholder="Search customers..." onChange={(e) => setCustomers(prev => prev.filter(c => c.name.toLowerCase().includes(e.target.value.toLowerCase())))} />
          <div className="max-h-64 overflow-y-auto space-y-2">{customers.map(c => <button key={c.id} onClick={() => { setSelectedCustomer(c); setShowCustomerModal(false); }} className="w-full p-3 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100"><p className="font-medium">{c.name}</p>{c.phone && <p className="text-sm text-gray-500">{c.phone}</p>}</button>)}</div>
          <Button variant="outline" className="w-full" onClick={() => { setSelectedCustomer(null); setShowCustomerModal(false); }}>Continue as Walk-in</Button>
        </div>
      </DialogContent></Dialog>

      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}><DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Sale Complete</DialogTitle></DialogHeader>
        <div className="space-y-4"><div className="text-center py-4"><Receipt className="h-12 w-12 mx-auto text-emerald-500 mb-2" /><p className="text-lg font-semibold">Transaction Successful</p>{lastSale && <p className="text-2xl font-bold">${lastSale.total?.toFixed(2)}</p>}</div>
          <DialogFooter><Button variant="outline" onClick={() => setShowReceiptModal(false)}>Continue Shopping</Button><Button onClick={() => window.print()}><Printer className="h-4 w-4 mr-2" />Print Receipt</Button></DialogFooter>
        </div>
      </DialogContent></Dialog>
    </div>
  );
}
