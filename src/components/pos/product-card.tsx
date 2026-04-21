"use client";

import { Package } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/api";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  disabled?: boolean;
  showStock?: boolean;
  stockQuantity?: number;
}

export function ProductCard({ 
  product, 
  onClick, 
  disabled = false,
  showStock = false,
  stockQuantity = 0
}: ProductCardProps) {
  const isOutOfStock = showStock && stockQuantity === 0;
  const isLowStock = showStock && stockQuantity > 0 && stockQuantity <= 5;

  return (
    <button
      onClick={() => !disabled && onClick(product)}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-start p-4 rounded-lg border border-border-light bg-white transition-all duration-200",
        "hover:border-primary hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed hover:border-border-light hover:shadow-none",
        isOutOfStock && "bg-gray-50"
      )}
    >
      <div className="h-16 w-full rounded-md bg-surface-raised flex items-center justify-center mb-3 overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-8 w-8 text-muted-foreground" />
        )}
      </div>

      <p className="font-medium text-sm text-left w-full line-clamp-2 mb-1">
        {product.name}
      </p>

      <p className="text-xs text-muted-foreground font-mono mb-2">
        {product.sku}
      </p>

      <div className="flex items-center justify-between w-full mt-auto">
        <span className="text-lg font-bold text-primary">
          {formatCurrency(product.price)}
        </span>
        
        {showStock && (
          <span className={cn(
            "text-xs px-2 py-1 rounded-full",
            isOutOfStock && "bg-error-bg text-error",
            isLowStock && "bg-warning-bg text-warning",
            !isOutOfStock && !isLowStock && "bg-success-bg text-success"
          )}>
            {isOutOfStock ? "Out" : stockQuantity}
          </span>
        )}
      </div>

      {isOutOfStock && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
          <span className="text-sm font-medium text-error">Out of Stock</span>
        </div>
      )}
    </button>
  );
}