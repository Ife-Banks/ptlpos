"use client";

import { useState, useCallback, useRef } from "react";
import { Search, Barcode, Loader2, Package, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { productsApi } from "@/lib/api/products";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";
import type { Product } from "@/types/api";

interface ProductSearchProps {
  onSelectProduct: (product: any) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function ProductSearch({ 
  onSelectProduct, 
  placeholder = "Search products by name or SKU...",
  autoFocus = false 
}: ProductSearchProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const barcodeBuffer = useRef("");
  const lastKeyTime = useRef<number>(0);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length >= 2);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (value.length >= 2) {
      setIsSearching(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await productsApi.list({ search: value, limit: 10 });
          setResults(Array.isArray(res.data) ? res.data : []);
        } catch {
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, []);

  const handleSelectProduct = useCallback((product: any) => {
    onSelectProduct(product);
    setQuery("");
    setShowResults(false);
  }, [onSelectProduct]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setQuery("");
      setShowResults(false);
      inputRef.current?.blur();
    }
  }, []);

  // Handle / shortcut to focus search
  useState(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });

  return (
    <div className="relative">
      <div className="relative">
        <Search className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5",
          isDark ? "text-gray-500" : "text-gray-400"
        )} />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "h-11 pl-10 pr-20 text-base rounded-lg border",
            isDark 
              ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#0066FF]" 
              : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#003D9B]"
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isSearching ? (
            <Loader2 className={cn("h-4 w-4 animate-spin", isDark ? "text-gray-500" : "text-gray-400")} />
          ) : (
            <div className={cn(
              "flex items-center gap-1 text-xs px-2 py-1 rounded",
              isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
            )}>
              <Barcode className="h-3 w-3" />
              <span>Scan</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className={cn(
          "absolute z-50 mt-1 w-full max-h-80 overflow-auto rounded-lg border shadow-xl",
          isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        )}>
          {results.length > 0 ? (
            <div className="p-1">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-left",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>
                      {product.sku}
                    </div>
                  </div>
                  <div className="font-semibold text-[#003D9B] dark:text-[#0066FF]">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </div>
                </button>
              ))}
            </div>
          ) : isSearching ? (
            <div className={cn(
              "flex items-center justify-center py-6",
              isDark ? "text-gray-500" : "text-gray-400"
            )}>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Searching...</span>
            </div>
          ) : (
            <div className={cn(
              "text-xs px-3 py-2",
              isDark ? "text-gray-500" : "text-gray-500"
            )}>
              No products found
            </div>
          )}
          
          {/* Close button */}
          <button
            onClick={() => setShowResults(false)}
            className={cn(
              "absolute top-2 right-2 p-1 rounded-full",
              isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}