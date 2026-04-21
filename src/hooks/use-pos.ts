"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePOSStore } from "@/stores/pos-store";
import { salesApi } from "@/lib/api/sales";
import type { CreateSaleItem, CompleteSaleRequest } from "@/types/api";

export function usePOS() {
  const queryClient = useQueryClient();
  
  const {
    activeSale,
    cartItems,
    heldSales,
    attachedCustomer,
    isPaymentModalOpen,
    setActiveSale,
    setCartItems,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
    setHeldSales,
    addHeldSale,
    removeHeldSale,
    setAttachedCustomer,
    setPaymentModalOpen,
    getCartTotal,
    getCartSubtotal,
    getCartTax,
    getCartItemCount,
  } = usePOSStore();

  const createSaleMutation = useMutation({
    mutationFn: (data: { customerId?: string; branchId?: string }) => 
      salesApi.create(data),
    onSuccess: (sale) => {
      setActiveSale(sale);
    },
  });

  const addItemMutation = useMutation({
    mutationFn: ({ saleId, item }: { saleId: string; item: CreateSaleItem }) =>
      salesApi.addItem(saleId, item),
    onSuccess: (sale) => {
      setActiveSale(sale);
      setCartItems(sale.items);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: ({ saleId, itemId }: { saleId: string; itemId: string }) =>
      salesApi.removeItem(saleId, itemId),
    onSuccess: (sale) => {
      setActiveSale(sale);
      setCartItems(sale.items);
    },
  });

  const holdSaleMutation = useMutation({
    mutationFn: (saleId: string) => salesApi.hold(saleId),
    onSuccess: (sale) => {
      addHeldSale(sale);
      clearCart();
    },
  });

  const resumeSaleMutation = useMutation({
    mutationFn: (saleId: string) => salesApi.resume(saleId),
    onSuccess: (sale) => {
      setActiveSale(sale);
      setCartItems(sale.items);
    },
  });

  const completeSaleMutation = useMutation({
    mutationFn: ({ saleId, data }: { saleId: string; data: CompleteSaleRequest }) =>
      salesApi.complete(saleId, data),
    onSuccess: () => {
      clearCart();
    },
  });

  useQuery({
    queryKey: ["sales", "held"],
    queryFn: () => salesApi.list({ status: "HELD" }),
    enabled: isPaymentModalOpen === false,
  });

  const createNewSale = useCallback((branchId?: string) => {
    return createSaleMutation.mutateAsync({ 
      customerId: attachedCustomer?.id,
      branchId 
    });
  }, [createSaleMutation, attachedCustomer]);

  const addToCart = useCallback(async (item: CreateSaleItem) => {
    if (!activeSale) {
      const newSale = await createNewSale();
      return addItemMutation.mutateAsync({ 
        saleId: newSale.id, 
        item 
      });
    }
    return addItemMutation.mutateAsync({ 
      saleId: activeSale.id, 
      item 
    });
  }, [activeSale, createNewSale, addItemMutation]);

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!activeSale) return;
    return removeItemMutation.mutateAsync({ 
      saleId: activeSale.id, 
      itemId 
    });
  }, [activeSale, removeItemMutation]);

  const holdSale = useCallback(async () => {
    if (!activeSale) return;
    return holdSaleMutation.mutateAsync(activeSale.id);
  }, [activeSale, holdSaleMutation]);

  const resumeSale = useCallback(async (saleId: string) => {
    return resumeSaleMutation.mutateAsync(saleId);
  }, [resumeSaleMutation]);

  const completeSale = useCallback(async (data: CompleteSaleRequest) => {
    if (!activeSale) return;
    return completeSaleMutation.mutateAsync({ 
      saleId: activeSale.id, 
      data 
    });
  }, [activeSale, completeSaleMutation]);

  const startNewSale = useCallback(() => {
    clearCart();
    setPaymentModalOpen(false);
  }, [clearCart, setPaymentModalOpen]);

  return {
    activeSale,
    cartItems,
    heldSales,
    attachedCustomer,
    isPaymentModalOpen,
    
    cartTotal: getCartTotal(),
    cartSubtotal: getCartSubtotal(),
    cartTax: getCartTax(),
    cartItemCount: getCartItemCount(),
    
    createNewSale,
    addToCart,
    removeFromCart,
    holdSale,
    resumeSale,
    completeSale,
    startNewSale,
    setAttachedCustomer,
    setPaymentModalOpen,
    
    isAddingItem: addItemMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isHolding: holdSaleMutation.isPending,
    isResuming: resumeSaleMutation.isPending,
    isCompleting: completeSaleMutation.isPending,
  };
}