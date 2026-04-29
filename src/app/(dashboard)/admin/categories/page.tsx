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
  Search,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Tags,
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
import { categoriesApi } from "@/lib/api/categories";

const ITEMS_PER_PAGE = 10;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    parentId: "",
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadCategories();
  };

  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await categoriesApi.list({
        q: searchQuery || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      const arr = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      setCategories(arr);
      setTotal(arr.length);
    } catch (err) {
      setError("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleSaveCategory = async () => {
    if (!newCategory.name) {
      setError("Please enter a category name");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description || undefined,
        parentId: newCategory.parentId || undefined,
        isActive: newCategory.isActive,
      };
      
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, categoryData);
      } else {
        await categoriesApi.create(categoryData);
      }
      setIsCreateModalOpen(false);
      setEditingCategory(null);
      setNewCategory({
        name: "",
        description: "",
        parentId: "",
        isActive: true,
      });
      loadCategories();
    } catch (err) {
      setError("Failed to save category");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoriesApi.delete(id);
      loadCategories();
    } catch (err) {
      setError("Failed to delete category");
      console.error(err);
    }
  };

  const openEditModal = (category: any) => {
    setNewCategory({
      name: category.name,
      description: category.description || "",
      parentId: category.parentId || "",
      isActive: category.isActive,
    });
    setEditingCategory(category);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Organize your products into categories.</p>
        </div>
        <Button 
          className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
          onClick={() => {
            setNewCategory({
              name: "",
              description: "",
              parentId: "",
              isActive: true,
            });
            setEditingCategory(null);
            setIsCreateModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search categories..."
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
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Category</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Parent</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Products</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No categories found. Add your first category to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#003D9B]/10 dark:bg-[#0066FF]/20 flex items-center justify-center">
                            <Tags className="h-5 w-5 text-[#003D9B] dark:text-[#0066FF]" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 dark:text-gray-400">
                          {category.parent?.name || (category.parentId ? "Parent" : "-")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 dark:text-gray-400">
                          {category.productCount || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={category.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => openEditModal(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} categories
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
          setEditingCategory(null);
          setError("");
        }
      }}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              {editingCategory ? "Update category details." : "Create a new category for your products."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
              <Input
                id="name"
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="parentId" className="text-sm font-medium text-gray-700 dark:text-gray-300">Parent Category</label>
              <select
                id="parentId"
                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003D9B] dark:focus:ring-[#0066FF] focus:ring-offset-2"
                value={newCategory.parentId}
                onChange={(e) => setNewCategory({ ...newCategory, parentId: e.target.value })}
              >
                <option value="">No parent (top level)</option>
                {categories.filter(c => c.id !== editingCategory?.id).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <Input
                id="description"
                placeholder="Category description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={newCategory.isActive}
                onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                className="w-4 h-4 text-[#003D9B] dark:text-[#0066FF] border-gray-300 dark:border-gray-600 rounded focus:ring-[#003D9B] dark:focus:ring-[#0066FF]"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSaveCategory}
              disabled={isSaving}
              className="bg-[#003D9B] hover:bg-[#003D9B]/90 dark:bg-[#0066FF] dark:hover:bg-[#0066FF]/90 text-white"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editingCategory ? "Update Category" : "Save Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}