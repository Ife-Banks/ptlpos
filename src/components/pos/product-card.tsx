"use client";

import { Package } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    imageUrl?: string | null;
    stock?: number;
  };
  onClick: (product: any) => void;
  disabled?: boolean;
}

export function ProductCard({ product, onClick, disabled = false }: ProductCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isOutOfStock = product.stock === 0;

  return (
    <button
      onClick={() => !disabled && onClick(product)}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-start p-3 rounded-xl border transition-all duration-200",
        isDark 
          ? "bg-gray-900 border-gray-800 hover:border-[#0066FF] hover:shadow-[0_0_20px_rgba(0,102,255,0.15)]" 
          : "bg-white border-gray-200 hover:border-[#003D9B] hover:shadow-lg",
        isOutOfStock && "opacity-60",
        "focus:outline-none focus:ring-2 focus:ring-[#003D9B]/40 focus:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Product Image */}
      <div className={cn(
        "h-14 w-full rounded-lg flex items-center justify-center mb-2 overflow-hidden",
        isDark ? "bg-gray-800" : "bg-gray-100"
      )}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className={cn("h-7 w-7", isDark ? "text-gray-600" : "text-gray-400")} />
        )}
      </div>

      {/* Product Name */}
      <p className={cn(
        "font-medium text-left w-full line-clamp-2 mb-0.5 text-sm",
        isDark ? "text-gray-100" : "text-gray-900"
      )}>
        {product.name}
      </p>

      {/* SKU */}
      <p className={cn(
        "text-xs font-mono mb-2",
        isDark ? "text-gray-500" : "text-gray-500"
      )}>
        {product.sku}
      </p>

      {/* Price and Stock */}
      <div className="flex items-center justify-between w-full mt-auto">
        <span className="text-lg font-bold text-[#003D9B] dark:text-[#0066FF]">
          {formatCurrency(product.price)}
        </span>
        
        {product.stock !== undefined && (
          <span className={cn(
            "text-xs px-1.5 py-0.5 rounded-full font-medium",
            isOutOfStock 
              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" 
              : product.stock <= 10
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          )}>
            {isOutOfStock ? "Out" : product.stock}
          </span>
        )}
      </div>

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center rounded-xl",
          isDark ? "bg-gray-900/80" : "bg-white/80"
        )}>
          <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
            Out of Stock
          </span>
        </div>
      )}
    </button>
  );
}