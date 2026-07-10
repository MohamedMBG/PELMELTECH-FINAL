"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Eye, Pencil, Trash2, Star, FileText, Sparkles } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getProducts, deleteProduct } from "@/lib/admin-store";
import type { AdminProduct } from "@/lib/admin-types";
import { useLanguage } from "@/i18n";

export default function ProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [arrivalFilter, setArrivalFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter && p.categoryName !== categoryFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (stockFilter && (p.stockStatus ?? "in-stock") !== stockFilter) return false;
      if (arrivalFilter === "new" && !p.newArrival) return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter, stockFilter, arrivalFilter]);

  const categoryNames = useMemo(
    () => Array.from(new Set(products.map((p) => p.categoryName))).sort(),
    [products]
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteProduct(deleteTarget.id);
    setProducts(await getProducts());
    setDeleteTarget(null);
    setToast(t.admin.productDeleted);
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <>
      <AdminHeader
        title={t.admin.products}
        actions={
          <Link
            href="/admin/products/new"
            className="hidden sm:inline-flex items-center gap-2 bg-on-surface text-white px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase hover:bg-on-surface/90 transition-colors"
          >
            <Plus size={14} />
            {t.admin.addProduct}
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
              placeholder={t.admin.searchProducts}
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
            <option value="">{t.admin.allCategories}</option>
            {categoryNames.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-black/[0.08] rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
          >
            <option value="">{t.admin.allStatus}</option>
            <option value="published">{t.admin.published}</option>
            <option value="draft">{t.admin.draft}</option>
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-white border border-black/[0.08] rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
          >
            <option value="">All Stock</option>
            <option value="in-stock">En stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
          <select
            value={arrivalFilter}
            onChange={(e) => setArrivalFilter(e.target.value)}
            className="bg-white border border-black/[0.08] rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
          >
            <option value="">All Arrivals</option>
            <option value="new">Nouveau arrivage</option>
          </select>
        </div>

        {/* Mobile add button */}
        <Link
          href="/admin/products/new"
          className="sm:hidden flex items-center justify-center gap-2 bg-on-surface text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase"
        >
          <Plus size={14} />
          {t.admin.addProduct}
        </Link>

        <p className="text-xs text-on-surface-variant">
          {t.admin.showingOfProducts
            .replace("{count}", String(filtered.length))
            .replace("{total}", String(products.length))}
        </p>

        {/* Table / Empty */}
        {filtered.length === 0 ? (
          <EmptyState
            title={t.admin.noProductsFound}
            description={products.length === 0 ? t.admin.addFirstProduct : t.admin.adjustSearchFilters}
            actionLabel={products.length === 0 ? t.admin.addProduct : undefined}
            actionHref={products.length === 0 ? "/admin/products/new" : undefined}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-[#f8f9fb] text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant/60">
                    <th className="py-3 px-5 w-16">{t.admin.image}</th>
                    <th className="py-3 px-5">{t.admin.productName}</th>
                    <th className="py-3 px-5">{t.admin.category}</th>
                    <th className="py-3 px-5">{t.admin.price}</th>
                    <th className="py-3 px-5 text-center">{t.admin.stock}</th>
                    <th className="py-3 px-5 text-center">{t.admin.status}</th>
                    <th className="py-3 px-5 text-center w-16">{t.admin.newLabel}</th>
                    <th className="py-3 px-5 text-center w-16">{t.admin.featured}</th>
                    <th className="py-3 px-5 text-right">{t.admin.actions}</th>
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
                          <span className="italic text-xs">{t.admin.requestQuote}</span>
                        ) : (
                          `${product.price?.toFixed(2)} DH`
                        )}
                      </td>
                      <td className="py-3 px-5 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          (product.stockStatus ?? "in-stock") === "out-of-stock"
                            ? "bg-red-50 text-red-600"
                            : "bg-cyan/10 text-cyan-dark"
                        }`}>
                          {(product.stockStatus ?? "in-stock") === "out-of-stock" ? t.admin.outOfStock : t.admin.inStock}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="py-3 px-5 text-center">
                        {product.newArrival ? (
                          <Sparkles size={16} className="text-cyan-dark inline-block" />
                        ) : (
                          <Sparkles size={16} className="text-on-surface-variant/20 inline-block" />
                        )}
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
                            title={t.admin.view}
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 rounded-lg hover:bg-black/5 text-on-surface-variant transition-colors"
                            title={t.admin.edit}
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-2 rounded-lg hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors"
                            title={t.admin.delete}
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
        title={t.admin.deleteProduct}
        message={t.admin.deleteProductMessage.replace("{name}", deleteTarget?.name || "")}
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
