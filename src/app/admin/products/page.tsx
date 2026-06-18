"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Search, Eye, Pencil, Trash2, Star, FileText } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getProducts, getCategories, deleteProduct } from "@/lib/admin-store";
import type { AdminProduct, AdminCategory } from "@/lib/admin-types";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setProducts(getProducts());
    setCategories(getCategories());
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter && p.categoryName !== categoryFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const categoryNames = useMemo(
    () => Array.from(new Set(products.map((p) => p.categoryName))).sort(),
    [products]
  );

  function handleDelete() {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    setProducts(getProducts());
    setDeleteTarget(null);
    setToast("Product deleted");
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <>
      <AdminHeader
        title="Products"
        actions={
          <Link
            href="/admin/products/new"
            className="hidden sm:inline-flex items-center gap-2 bg-on-surface text-white px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase hover:bg-on-surface/90 transition-colors"
          >
            <Plus size={14} />
            Add Product
          </Link>
        }
      />

      <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-black/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:border-cyan/40 transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-black/[0.08] rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categoryNames.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-black/[0.08] rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Mobile add button */}
        <Link
          href="/admin/products/new"
          className="sm:hidden flex items-center justify-center gap-2 bg-on-surface text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase"
        >
          <Plus size={14} />
          Add Product
        </Link>

        <p className="text-xs text-on-surface-variant">
          Showing <span className="font-bold text-on-surface">{filtered.length}</span> of {products.length} products
        </p>

        {/* Table / Empty */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No products found"
            description={products.length === 0 ? "Add your first product to get started." : "Try adjusting your search or filters."}
            actionLabel={products.length === 0 ? "Add Product" : undefined}
            actionHref={products.length === 0 ? "/admin/products/new" : undefined}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-[#f8f9fb] text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant/60">
                    <th className="py-3 px-5 w-16">Image</th>
                    <th className="py-3 px-5">Product Name</th>
                    <th className="py-3 px-5">Category</th>
                    <th className="py-3 px-5">Price</th>
                    <th className="py-3 px-5 text-center">Status</th>
                    <th className="py-3 px-5 text-center w-16">Featured</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-black/[0.04]">
                  {filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-[#f8f9fb] transition-colors">
                      <td className="py-3 px-5">
                        <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden border border-black/[0.06]">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText size={14} className="text-on-surface-variant/30" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-5 font-semibold text-on-surface">{product.name}</td>
                      <td className="py-3 px-5 text-on-surface-variant">{product.categoryName}</td>
                      <td className="py-3 px-5 font-mono text-on-surface-variant">
                        {product.quoteOnly ? (
                          <span className="italic text-xs">Request Quote</span>
                        ) : (
                          `$${product.price?.toFixed(2)}`
                        )}
                      </td>
                      <td className="py-3 px-5 text-center">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="py-3 px-5 text-center">
                        {product.featured ? (
                          <Star size={16} className="text-magenta inline-block" fill="currentColor" />
                        ) : (
                          <Star size={16} className="text-on-surface-variant/20 inline-block" />
                        )}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/catalog/${product.slug}`}
                            className="p-2 rounded-lg hover:bg-black/5 text-on-surface-variant transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 rounded-lg hover:bg-black/5 text-on-surface-variant transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-2 rounded-lg hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 bg-on-surface text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-50 animate-[fadeIn_0.2s]">
          {toast}
        </div>
      )}
    </>
  );
}
