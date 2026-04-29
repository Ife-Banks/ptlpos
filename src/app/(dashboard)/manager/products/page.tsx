"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Loader2,
  Package,
  ImageIcon,
  Edit,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import type { Category } from "@/lib/api/categories";
import type { Product, ProductType } from "@/types/api";
import { cn } from "@/lib/utils";

const productTypes: { value: ProductType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "SIMPLE", label: "Simple" },
  { value: "VARIANT", label: "Variant" },
  { value: "COMPOSITE", label: "Composite" },
];

const getTypeBadge = (type: string) => {
  switch (type) {
    case "SIMPLE":
      return { label: "Simple", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
    case "VARIANT":
      return { label: "Variant", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "COMPOSITE":
      return { label: "Composite", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
    default:
      return { label: type, className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
  }
};

const ITEMS_PER_PAGE = 15;

export default function ManagerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ProductType | "">("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    barcode: "",
    type: "SIMPLE" as ProductType,
    price: "",
    cost: "",
    taxRate: "",
    categoryId: "",
    imageUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
      loadCategories();
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedType, selectedCategory, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadProducts();
  };

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const filter: any = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      if (searchQuery) filter.search = searchQuery;
      if (selectedType) filter.type = selectedType;
      if (selectedCategory) filter.category = selectedCategory;

      const response = await productsApi.list(filter);
      const arr = Array.isArray(response.data) ? response.data : [];
      setProducts(arr);
      setTotal(response.total || arr.length);
    } catch (err) {
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.list({ page: 1, limit: 100 });
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setCategories([]);
    }
  };

  const handleSaveProduct = async () => {
    setIsSaving(true);
    try {
      const productData = {
        name: newProduct.name,
        sku: newProduct.sku,
        barcode: newProduct.barcode || undefined,
        type: newProduct.type,
        price: parseFloat(newProduct.price) || 0,
        cost: newProduct.cost ? parseFloat(newProduct.cost) : undefined,
        taxRate: newProduct.taxRate ? parseFloat(newProduct.taxRate) : undefined,
        category: newProduct.categoryId || undefined,
        imageUrl: newProduct.imageUrl || undefined,
      };

      if (isEditingProduct) {
        await productsApi.update(isEditingProduct.id, productData);
      } else {
        await productsApi.create(productData);
      }
      setIsCreateModalOpen(false);
      loadProducts();
    } catch (err) {
      setError("Failed to save product");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (product: Product) => {
    setNewProduct({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode || "",
      type: product.type,
      price: String(product.price),
      cost: product.cost ? String(product.cost) : "",
      taxRate: product.taxRate ? String(product.taxRate) : "",
      categoryId: (product as any).category?.id || "",
      imageUrl: product.imageUrl || "",
    });
    setIsEditingProduct(product);
    setIsCreateModalOpen(true);
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || "-";
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your product inventory and catalog.</p>
        </div>
        <Button
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
          onClick={() => {
            setNewProduct({
              name: "",
              sku: "",
              barcode: "",
              type: "SIMPLE",
              price: "",
              cost: "",
              taxRate: "",
              categoryId: "",
              imageUrl: "",
            });
            setIsEditingProduct(null);
            setIsCreateModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Filter className="mr-2 h-4 w-4" />
                {selectedType || "All Types"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              {productTypes.map((type) => (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() => {
                    setSelectedType(type.value);
                    setCurrentPage(1);
                  }}
                >
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Filter className="mr-2 h-4 w-4" />
                {selectedCategory ? getCategoryName(selectedCategory) : "All Categories"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuItem onClick={() => { setSelectedCategory(""); setCurrentPage(1); }}>
                All Categories
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                >
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Product</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">SKU</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Category</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Type</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium text-right">Price</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium text-right">Cost</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const typeBadge = getTypeBadge(product.type);
                    return (
                      <TableRow
                        key={product.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-gray-600 dark:text-gray-400">
                            {product.sku}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 dark:text-gray-400">
                            {getCategoryName((product as any).category?.id)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeBadge.className}>{typeBadge.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium text-gray-900 dark:text-white">
                            ${Number(product.price || 0).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-gray-600 dark:text-gray-400">
                            {product.cost ? `$${Number(product.cost).toFixed(2)}` : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Name *
              </label>
              <Input
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="Enter product name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SKU *
              </label>
              <Input
                value={newProduct.sku}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sku: e.target.value })
                }
                placeholder="SKU"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Barcode
              </label>
              <Input
                value={newProduct.barcode}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, barcode: e.target.value })
                }
                placeholder="Barcode"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                value={newProduct.type}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    type: e.target.value as ProductType,
                  })
                }
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              >
                <option value="SIMPLE">Simple</option>
                <option value="VARIANT">Variant</option>
                <option value="COMPOSITE">Composite</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={newProduct.categoryId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, categoryId: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Price *
              </label>
              <Input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cost
              </label>
              <Input
                type="number"
                step="0.01"
                value={newProduct.cost}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, cost: e.target.value })
                }
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Image URL
              </label>
              <Input
                value={newProduct.imageUrl}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, imageUrl: e.target.value })
                }
                placeholder="https://..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={!newProduct.name || !newProduct.sku || !newProduct.price || isSaving}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90"
            >
              {isSaving ? "Saving..." : isEditingProduct ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}