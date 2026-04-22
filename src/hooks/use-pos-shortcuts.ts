"use client";

import { useEffect, useCallback } from "react";
import { usePOSStore } from "@/stores/pos-store";

export function usePOSShortcuts() {
  const {
    setPaymentModalOpen,
    activeSale,
    clearCart,
  } = usePOSStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      return;
    }

    switch (e.key) {
      case "F2":
        e.preventDefault();
        break;

      case "F4":
        e.preventDefault();
        setPaymentModalOpen(true);
        break;

      case "Escape":
        e.preventDefault();
        break;

      case "/":
        e.preventDefault();
        break;
    }
  }, [setPaymentModalOpen, activeSale]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}