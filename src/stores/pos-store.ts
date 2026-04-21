import { create } from "zustand";
import type { Sale, SaleItem } from "@/types/api";

interface POSState {
  activeSale: Sale | null;
  cartItems: SaleItem[];
  heldSales: Sale[];
  attachedCustomer: { id: string; name: string } | null;
  isCartOpen: boolean;
  isPaymentModalOpen: boolean;
  
  setActiveSale: (sale: Sale | null) => void;
  setCartItems: (items: SaleItem[]) => void;
  addCartItem: (item: SaleItem) => void;
  updateCartItem: (itemId: string, updates: Partial<SaleItem>) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;
  
  setHeldSales: (sales: Sale[]) => void;
  addHeldSale: (sale: Sale) => void;
  removeHeldSale: (saleId: string) => void;
  
  setAttachedCustomer: (customer: { id: string; name: string } | null) => void;
  
  setCartOpen: (open: boolean) => void;
  setPaymentModalOpen: (open: boolean) => void;
  
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartTax: () => number;
  getCartItemCount: () => number;
}

export const usePOSStore = create<POSState>((set, get) => ({
  activeSale: null,
  cartItems: [],
  heldSales: [],
  attachedCustomer: null,
  isCartOpen: true,
  isPaymentModalOpen: false,

  setActiveSale: (sale) => set({ activeSale: sale }),
  
  setCartItems: (items) => set({ cartItems: items }),
  
  addCartItem: (item) => set((state) => ({ 
    cartItems: [...state.cartItems, item] 
  })),
  
  updateCartItem: (itemId, updates) => set((state) => ({
    cartItems: state.cartItems.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    ),
  })),
  
  removeCartItem: (itemId) => set((state) => ({
    cartItems: state.cartItems.filter((item) => item.id !== itemId),
  })),
  
  clearCart: () => set({ 
    cartItems: [], 
    activeSale: null, 
    attachedCustomer: null 
  }),

  setHeldSales: (sales) => set({ heldSales: sales }),
  addHeldSale: (sale) => set((state) => ({ 
    heldSales: [...state.heldSales, sale] 
  })),
  removeHeldSale: (saleId) => set((state) => ({
    heldSales: state.heldSales.filter((s) => s.id !== saleId),
  })),

  setAttachedCustomer: (customer) => set({ attachedCustomer: customer }),
  
  setCartOpen: (open) => set({ isCartOpen: open }),
  setPaymentModalOpen: (open) => set({ isPaymentModalOpen: open }),

  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  },
  
  getCartSubtotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  },
  
  getCartTax: () => {
    const { cartItems } = get();
    return cartItems.reduce((sum, item) => sum + item.taxAmount, 0);
  },
  
  getCartItemCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },
}));