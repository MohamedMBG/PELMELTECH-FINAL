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
import { useLanguage } from "@/i18n";

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
  const { t } = useLanguage();

  useEffect(() => {
    setStats(getAdminStats());
  }, []);

  if (!stats) {
    return (
      <>
        <AdminHeader title={t.admin.dashboard} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-on-surface/20 border-t-on-surface rounded-full animate-spin" />
        </div>
      </>
    );
  }

  const cards = [
    { label: t.admin.totalProducts, value: stats.totalProducts, icon: Package, href: "/admin/products", color: "text-on-surface" },
    { label: t.admin.categories, value: stats.totalCategories, icon: FolderTree, href: "/admin/categories", color: "text-on-surface" },
    { label: t.admin.featured, value: stats.featuredProducts, icon: Star, href: "/admin/products", color: "text-magenta" },
    { label: t.admin.quoteRequests, value: stats.totalQuotes, icon: MessageSquareQuote, href: "/admin/quotes", color: "text-cyan-dark", extra: stats.newQuotes > 0 ? `${stats.newQuotes} ${t.admin.newLabel}` : undefined },
  ];

  return (
    <>
      <AdminHeader title={t.admin.dashboard} />
      <div className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl border border-black/[0.06] p-5 hover:shadow-lg hover:shadow-black/[0.04] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-on-surface-variant/60">{card.label}</span>
                <card.icon size={18} className="text-on-surface-variant/30 group-hover:text-on-surface-variant/50 transition-colors" />
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-extrabold tracking-tight ${card.color}`}>{card.value}</span>
                {card.extra && <span className="text-xs font-bold text-cyan-dark mb-1">{card.extra}</span>}
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <h2 className="text-base font-bold text-on-surface mb-4">{t.admin.quickActions}</h2>
            <div className="space-y-2">
              <Link href="/admin/products/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-magenta/10 flex items-center justify-center"><Plus size={16} className="text-magenta" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{t.admin.addProduct}</p>
                  <p className="text-xs text-on-surface-variant">{t.admin.createProduct}</p>
                </div>
                <ArrowRight size={14} className="text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors rtl:rotate-180" />
              </Link>
              <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-cyan/10 flex items-center justify-center"><Package size={16} className="text-cyan-dark" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{t.admin.manageProducts}</p>
                  <p className="text-xs text-on-surface-variant">{t.admin.manageProductsDesc}</p>
                </div>
                <ArrowRight size={14} className="text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors rtl:rotate-180" />
              </Link>
              <Link href="/admin/categories" className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center"><FolderTree size={16} className="text-on-surface-variant" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{t.admin.manageCategories}</p>
                  <p className="text-xs text-on-surface-variant">{t.admin.manageCategoriesDesc}</p>
                </div>
                <ArrowRight size={14} className="text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors rtl:rotate-180" />
              </Link>
              <Link href="/admin/quotes" className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-cyan/10 flex items-center justify-center"><MessageSquareQuote size={16} className="text-cyan-dark" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{t.admin.quoteRequests}</p>
                  <p className="text-xs text-on-surface-variant">{t.admin.quoteRequestsDesc}</p>
                </div>
                <ArrowRight size={14} className="text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors rtl:rotate-180" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-black/[0.06] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-on-surface">{t.admin.recentProducts}</h2>
              <Link href="/admin/products" className="text-xs font-bold text-cyan-dark hover:underline">{t.admin.viewAll}</Link>
            </div>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant/60">
                    <th className="pb-3 pr-4">{t.admin.product}</th>
                    <th className="pb-3 pr-4">{t.admin.category}</th>
                    <th className="pb-3 pr-4">{t.admin.price}</th>
                    <th className="pb-3">{t.admin.status}</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {stats.recentProducts.map((product) => (
                    <tr key={product.id} className="border-t border-black/[0.04]">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-black/[0.06]">
                            {product.imageUrl ? (
                              <Image src={product.imageUrl} alt={product.name} width={36} height={36} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><FileText size={14} className="text-on-surface-variant/30" /></div>
                            )}
                          </div>
                          <span className="font-semibold text-on-surface truncate max-w-[180px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-on-surface-variant">{product.categoryName}</td>
                      <td className="py-3 pr-4 font-mono text-on-surface-variant">
                        {product.quoteOnly ? <span className="italic text-xs">{t.admin.quote}</span> : `$${product.price?.toFixed(2)}`}
                      </td>
                      <td className="py-3"><StatusBadge status={product.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant/50 text-center pb-4">{t.admin.demoNote}</p>
      </div>
    </>
  );
}
