"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Barcode, Loader2, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { productsApi } from "@/lib/api/products";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/api";

interface ProductSearchProps {
  onSelectProduct: (product: Product) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function ProductSearch({ 
  onSelectProduct, 
  placeholder = "Search products by name, SKU, or barcode...",
  autoFocus = false 
}: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const barcodeBuffer = useRef("");
  const lastKeyTime = useRef<number>(0);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => productsApi.list({ search: query, limit: 20 }),
    enabled: query.length >= 2,
    staleTime: 30000,
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      setIsSearching(false);
    }, 300);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime.current;
      
      if (timeDiff > 100) {
        barcodeBuffer.current = "";
      }
      
      lastKeyTime.current = currentTime;
      
      if (e.key !== "Enter") {
        barcodeBuffer.current += e.key;
      } else {
        if (barcodeBuffer.current.length >= 8) {
          setQuery(barcodeBuffer.current);
          onSelectProduct({ sku: barcodeBuffer.current } as Product);
        }
        barcodeBuffer.current = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectProduct]);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="h-12 pl-10 pr-20 text-base"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading || isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Barcode className="h-3 w-3" />
              <span>Scan</span>
            </div>
          )}
        </div>
      </div>

      {query.length >= 2 && searchResults?.data && (
        <div className="absolute z-50 mt-1 max-h-96 w-full overflow-auto rounded-md border border-border bg-white shadow-lg">
          {searchResults.data.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No products found
            </div>
          ) : (
            <div className="divide-y divide-border-light">
              {searchResults.data.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-3 p-3 text-left hover:bg-surface"
                >
                  <div className="h-12 w-12 rounded-md bg-surface-raised flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">${product.price.toFixed(2)}</p>
                    {product.type === "COMPOSITE" && (
                      <span className="text-xs text-primary">Bundle</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}