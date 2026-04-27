"use client";

import { Package } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    sku?: string;
    price: number | string | { amount?: number };
    imageUrl?: string | null;
    stock?: number;
    category?: string | { name?: string };
  };
  onClick: (product: any) => void;
  disabled?: boolean;
}

function parsePrice(price: number | string | { amount?: number } | undefined | null): number {
  if (price === undefined || price === null) return 0;
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price) || 0;
  if (typeof price === 'object' && price !== null) return price.amount || 0;
  return 0;
}

export function ProductCard({ product, onClick, disabled = false }: ProductCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isOutOfStock = product.stock === 0;
  const parsedPrice = parsePrice(product.price);

  return (
    <button
      onClick={() => !disabled && onClick(product)}
      disabled={disabled}
      className={cn(
        "relative flex flex-col h-full p-3 rounded-xl border transition-all duration-200",
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
        "h-16 w-full rounded-lg flex items-center justify-center mb-2 overflow-hidden",
        isDark ? "bg-gray-800" : "bg-gray-100"
      )}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className={cn("h-8 w-8", isDark ? "text-gray-600" : "text-gray-400")} />
        )}
      </div>

      {/* Product Name */}
      <p className={cn(
        "font-semibold text-left w-full line-clamp-2 text-sm leading-tight mb-1",
        isDark ? "text-white" : "text-gray-900"
      )}>
        {product.name}
      </p>

      {/* Category Badge */}
      {product.category && (
        <p className={cn(
          "text-[10px] font-medium mb-1 truncate",
          isDark ? "text-gray-500" : "text-gray-400"
        )}>
          {typeof product.category === 'string' ? product.category : (product.category as any)?.name}
        </p>
      )}

      {/* SKU - More Visible */}
      <div className="flex items-center gap-1 mb-2">
        <span className={cn(
          "text-[10px] px-1.5 py-0.5 rounded font-mono",
          isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
        )}>
          {product.sku || "No SKU"}
        </span>
      </div>

      {/* Price and Stock */}
      <div className="flex items-center justify-between w-full mt-auto">
        <span className="text-lg font-bold text-[#003D9B] dark:text-[#0066FF]">
          {formatCurrency(parsedPrice)}
        </span>
        
        {product.stock !== undefined && (
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
            isOutOfStock 
              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" 
              : product.stock <= 10
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          )}>
            {isOutOfStock ? "Out" : `${product.stock} in stock`}
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