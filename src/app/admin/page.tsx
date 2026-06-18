"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  FolderTree,
  Star,
  MessageSquareQuote,
  Plus,
  ArrowRight,
  FileText,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { getAdminStats } from "@/lib/admin-store";
import type { AdminProduct } from "@/lib/admin-types";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  featuredProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalQuotes: number;
  newQuotes: number;
  recentProducts: AdminProduct[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(getAdminStats());
  }, []);

  if (!stats) {
    return (
      <>
        <AdminHeader title="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-on-surface/20 border-t-on-surface rounded-full animate-spin" />
        </div>
      </>
    );
  }

  const cards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, href: "/admin/products", color: "text-on-surface" },
    { label: "Categories", value: stats.totalCategories, icon: FolderTree, href: "/admin/categories", color: "text-on-surface" },
    { label: "Featured", value: stats.featuredProducts, icon: Star, href: "/admin/products", color: "text-magenta" },
    { label: "Quote Requests", value: stats.totalQuotes, icon: MessageSquareQuote, href: "/admin/quotes", color: "text-cyan-dark", extra: stats.newQuotes > 0 ? `${stats.newQuotes} new` : undefined },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl border border-black/[0.06] p-5 hover:shadow-lg hover:shadow-black/[0.04] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-on-surface-variant/60">
                  {card.label}
                </span>
                <card.icon size={18} className="text-on-surface-variant/30 group-hover:text-on-surface-variant/50 transition-colors" />
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-extrabold tracking-tight ${card.color}`}>
                  {card.value}
                </span>
                {card.extra && (
                  <span className="text-xs font-bold text-cyan-dark mb-1">{card.extra}</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions + Recent products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <h2 className="text-base font-bold text-on-surface mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-magenta/10 flex items-center justify-center">
                  <Plus size={16} className="text-magenta" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">Add Product</p>
                  <p className="text-xs text-on-surface-variant">Create a new product listing</p>
                </div>
                <ArrowRight size={14} className="text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors" />
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan/10 flex items-center justify-center">
                  <Package size={16} className="text-cyan-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">Manage Products</p>
                  <p className="text-xs text-on-surface-variant">Edit, delete, or update products</p>
                </div>
                <ArrowRight size={14} className="text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors" />
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center">
                  <FolderTree size={16} className="text-on-surface-variant" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">Manage Categories</p>
                  <p className="text-xs text-on-surface-variant">Organize product categories</p>
                </div>
                <ArrowRight size={14} className="text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors" />
              </Link>
              <Link
                href="/admin/quotes"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan/10 flex items-center justify-center">
                  <MessageSquareQuote size={16} className="text-cyan-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">Quote Requests</p>
                  <p className="text-xs text-on-surface-variant">View and respond to inquiries</p>
                </div>
                <ArrowRight size={14} className="text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors" />
              </Link>
            </div>
          </div>

          {/* Recent Products */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-black/[0.06] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-on-surface">Recent Products</h2>
              <Link
                href="/admin/products"
                className="text-xs font-bold text-cyan-dark hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant/60">
                    <th className="pb-3 pr-4">Product</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Price</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {stats.recentProducts.map((product) => (
                    <tr key={product.id} className="border-t border-black/[0.04]">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-black/[0.06]">
                            {product.imageUrl ? (
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={36}
                                height={36}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText size={14} className="text-on-surface-variant/30" />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-on-surface truncate max-w-[180px]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-on-surface-variant">{product.categoryName}</td>
                      <td className="py-3 pr-4 font-mono text-on-surface-variant">
                        {product.quoteOnly ? (
                          <span className="italic text-xs">Quote</span>
                        ) : (
                          `$${product.price?.toFixed(2)}`
                        )}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={product.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant/50 text-center pb-4">
          Demo admin panel &mdash; data stored in browser localStorage
        </p>
      </div>
    </>
  );
}
