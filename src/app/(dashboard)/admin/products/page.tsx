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
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  ImageIcon,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import type { Product, ProductType } from "@/types/api";

const productTypes: { value: ProductType; label: string }[] = [
  { value: "SIMPLE", label: "Simple" },
  { value: "VARIANT", label: "Variant" },
  { value: "COMPOSITE", label: "Composite" },
];

const ITEMS_PER_PAGE = 10;

const getTypeBadge = (type: string) => {
  switch (type) {
    case "SIMPLE":
      return { label: "Simple", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
    case "VARIANT":
      return { label: "Variant", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "COMPOSITE":
      return { label: "Composite", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
    default:
      return { label: type, className: "bg-gray-100 text-gray-700" };
  }
};

function formatCurrency(amount: number | undefined): string {
  if (amount === undefined || amount === null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    type: "SIMPLE" as ProductType,
    price: "",
    cost: "",
    taxRate: "",
    categoryId: "",
    imageUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedType, selectedCategory, currentPage]);

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.list({ limit: 100 });
      setCategories(response.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadProducts();
  };

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await productsApi.list({
        search: searchQuery || undefined,
        type: selectedType || undefined,
        category: selectedCategory || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setProducts(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.price) {
      setError("Please fill in required fields");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const productData: Partial<Product> = {
        name: newProduct.name,
        sku: newProduct.sku,
        type: newProduct.type,
        price: parseFloat(newProduct.price),
        cost: newProduct.cost ? parseFloat(newProduct.cost) : undefined,
        taxRate: newProduct.taxRate ? parseFloat(newProduct.taxRate) : 0,
        imageUrl: newProduct.imageUrl || undefined,
      };
      
      if (newProduct.categoryId) {
        productData.category = newProduct.categoryId;
      }

      if (isEditingProduct) {
        await productsApi.update(isEditingProduct.id, productData);
      } else {
        await productsApi.create(productData);
      }
      setIsCreateModalOpen(false);
      setIsEditingProduct(null);
      setNewProduct({
        name: "",
        sku: "",
        type: "SIMPLE",
        price: "",
        cost: "",
        taxRate: "",
        categoryId: "",
        imageUrl: "",
      });
      loadProducts();
    } catch (err) {
      setError("Failed to save product");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productsApi.delete(id);
      loadProducts();
    } catch (err) {
      setError("Failed to delete product");
      console.error(err);
    }
  };

  const openEditModal = (product: Product) => {
    setNewProduct({
      name: product.name,
      sku: product.sku,
      type: product.type,
      price: String(product.price),
      cost: product.cost ? String(product.cost) : "",
      taxRate: product.taxRate ? String(product.taxRate) : "",
      categoryId: product.category as string || "",
      imageUrl: product.imageUrl || "",
    });
    setIsEditingProduct(product);
    setIsCreateModalOpen(true);
  };

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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleSearch}
            className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <Search className="mr-2 h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Filter className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{selectedType || "All Types"}</span>
                <span className="sm:hidden">Type</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuItem onClick={() => { setSelectedType(null); setCurrentPage(1); }}>All Types</DropdownMenuItem>
              {productTypes.map((type) => (
                <DropdownMenuItem key={type.value} onClick={() => { setSelectedType(type.value); setCurrentPage(1); }}>{type.label}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Filter className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "All Categories"}</span>
                <span className="sm:hidden">Category</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <DropdownMenuItem onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}>All Categories</DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.id} onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}>{cat.name}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#003D9B] dark:text-[#0066FF]" />
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {!loading && !error && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Product</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">SKU</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Type</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Price</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Cost</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Tax Rate</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No products found. Add your first product to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const typeBadge = getTypeBadge(product.type);
                    return (
                      <TableRow key={product.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm text-gray-600 dark:text-gray-400">{product.sku}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeBadge.className}>{typeBadge.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(product.price)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 dark:text-gray-400">{formatCurrency(product.cost)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 dark:text-gray-400">{product.taxRate}%</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                              <DropdownMenuItem onClick={() => openEditModal(product)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-200 dark:border-gray-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-[#003D9B] dark:bg-[#0066FF] text-white" : "border-gray-200 dark:border-gray-700"}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-gray-200 dark:border-gray-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        setIsCreateModalOpen(open);
        if (!open) {
          setIsEditingProduct(null);
          setError("");
        }
      }}>
        <DialogContent className="sm:max-w-[525px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {isEditingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {isEditingProduct ? "Update product details." : "Create a new product in your catalog."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                <Input
                  id="name"
                  placeholder="Product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="sku" className="text-sm font-medium text-gray-700 dark:text-gray-300">SKU *</label>
                <Input
                  id="sku"
                  placeholder="SKU-001"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value.toUpperCase() })}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="type" className="text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003D9B] dark:focus:ring-[#0066FF] focus:ring-offset-2"
                  value={newProduct.type}
                  onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value as ProductType })}
                >
                  {productTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003D9B] dark:focus:ring-[#0066FF] focus:ring-offset-2"
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium text-gray-700 dark:text-gray-300">Price *</label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="cost" className="text-sm font-medium text-gray-700 dark:text-gray-300">Cost</label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newProduct.cost}
                  onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="taxRate" className="text-sm font-medium text-gray-700 dark:text-gray-300">Tax Rate %</label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={newProduct.taxRate}
                  onChange={(e) => setNewProduct({ ...newProduct, taxRate: e.target.value })}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSaveProduct}
              disabled={isSaving}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isEditingProduct ? "Update Product" : "Save Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}