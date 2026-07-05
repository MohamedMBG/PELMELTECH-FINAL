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
  TrendingUp,
  AlertTriangle,
  ImageOff,
  DollarSign,
  Clock,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { BarList, Donut, Sparkbars, CHART_COLORS } from "@/components/admin/Charts";
import { getAdminStats, type AdminStats } from "@/lib/admin-store";
import { useLanguage } from "@/i18n";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    getAdminStats().then(setStats).catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <>
        <AdminHeader title={t.admin.dashboard} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="text-sm font-semibold text-on-surface">{t.admin.couldntLoadApi}</p>
          <p className="text-xs text-on-surface-variant max-w-sm">
            {t.admin.apiErrorHelp}
          </p>
          <button
            onClick={() => location.reload()}
            className="mt-2 bg-on-surface text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-on-surface/90 transition-colors"
          >
            {t.admin.retry}
          </button>
        </div>
      </>
    );
  }

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
    { label: t.admin.totalProducts, value: stats.totalProducts, icon: Package, href: "/admin/products", color: "text-on-surface", extra: `${stats.publishedProducts} ${t.admin.live} · ${stats.draftProducts} ${t.admin.draftLabel}` },
    { label: t.admin.categories, value: stats.totalCategories, icon: FolderTree, href: "/admin/categories", color: "text-on-surface" },
    { label: t.admin.featured, value: stats.featuredProducts, icon: Star, href: "/admin/products", color: "text-magenta" },
    { label: t.admin.quoteRequests, value: stats.quotes.total, icon: MessageSquareQuote, href: "/admin/quotes", color: "text-cyan-dark", extra: stats.quotes.new > 0 ? `${stats.quotes.new} ${t.admin.newLabel}` : undefined },
  ];

  const money = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;

  const metrics = [
    { label: t.admin.catalogValue, value: money(stats.catalogValue), sub: t.admin.pricedProducts, icon: DollarSign },
    { label: t.admin.avgPrice, value: money(stats.avgPrice), sub: t.admin.perPricedItem, icon: TrendingUp },
    { label: t.admin.openQuotes, value: stats.openQuotes, sub: `${stats.quotes.total} ${t.admin.total}`, icon: MessageSquareQuote },
    {
      label: t.admin.quotesThisWeek,
      value: stats.quotesThisWeek,
      sub: `${stats.weekTrend >= 0 ? "+" : ""}${stats.weekTrend}% ${t.admin.vsLastWeek}`,
      icon: TrendingUp,
      trendUp: stats.weekTrend >= 0,
    },
  ];

  const typeColors = [CHART_COLORS.cyan, CHART_COLORS.magenta, CHART_COLORS.muted, "#f59e0b", "#8b5cf6"];

  const alertGroups = [
    { label: t.admin.missingImage, items: stats.alerts.missingImage, icon: ImageOff },
    { label: t.admin.noPriceSet, items: stats.alerts.noPrice, icon: DollarSign },
    { label: t.admin.staleDrafts, items: stats.alerts.staleDrafts, icon: Clock },
    { label: t.admin.emptyCategories, items: stats.alerts.emptyCategories, icon: FolderTree },
  ];
  const totalAlerts = alertGroups.reduce((s, g) => s + g.items.length, 0);

  return (
    <>
      <AdminHeader title={t.admin.dashboard} />
      <div className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">
        {/* KPI cards */}
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
                {card.extra && <span className="text-[11px] font-bold text-on-surface-variant/70 mb-1">{card.extra}</span>}
              </div>
            </Link>
          ))}
        </div>

        {/* Business metrics strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white rounded-2xl border border-black/[0.06] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-on-surface-variant/60">{m.label}</span>
                <m.icon size={18} className="text-on-surface-variant/30" />
              </div>
              <p className="text-2xl font-extrabold tracking-tight text-on-surface">{m.value}</p>
              <p className={`text-[11px] font-bold mt-1 ${m.trendUp === false ? "text-red-500" : m.trendUp ? "text-emerald-600" : "text-on-surface-variant/70"}`}>
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Analytics row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quote funnel */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <h2 className="text-base font-bold text-on-surface mb-5">{t.admin.quoteFunnel}</h2>
            <Donut
              centerValue={`${stats.quotes.conversionRate}%`}
              centerLabel={t.admin.conversion}
              segments={[
                { label: t.admin.newLabel, value: stats.quotes.new, color: CHART_COLORS.cyan },
                { label: t.admin.inProgress, value: stats.quotes.inProgress, color: CHART_COLORS.magenta },
                { label: t.admin.done, value: stats.quotes.done, color: CHART_COLORS.muted },
              ]}
            />
          </div>

          {/* Quotes over time */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-black/[0.06] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-on-surface">{t.admin.quotesLast14Days}</h2>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-dark">
                <TrendingUp size={14} />
                {stats.quotesByDay.reduce((s, d) => s + d.count, 0)} {t.admin.total}
              </span>
            </div>
            <Sparkbars data={stats.quotesByDay} />
            <div className="flex justify-between mt-2 text-[10px] font-semibold text-on-surface-variant/50">
              <span>{stats.quotesByDay[0]?.name}</span>
              <span>{stats.quotesByDay[stats.quotesByDay.length - 1]?.name}</span>
            </div>
          </div>
        </div>

        {/* Distributions row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <h2 className="text-base font-bold text-on-surface mb-5">{t.admin.productsByCategory}</h2>
            <BarList data={stats.productsByCategory} color={CHART_COLORS.cyan} />
          </div>
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <h2 className="text-base font-bold text-on-surface mb-5">{t.admin.priceDistribution}</h2>
            <BarList data={stats.priceBuckets} color={CHART_COLORS.magenta} />
          </div>
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <h2 className="text-base font-bold text-on-surface mb-5">{t.admin.productsByType}</h2>
            <Donut
              segments={stats.productsByType.map((d, i) => ({
                label: d.name,
                value: d.count,
                color: typeColors[i % typeColors.length],
              }))}
            />
          </div>
        </div>

        {/* Inventory alerts */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={18} className={totalAlerts > 0 ? "text-amber-500" : "text-on-surface-variant/30"} />
            <h2 className="text-base font-bold text-on-surface">{t.admin.inventoryAlerts}</h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${totalAlerts > 0 ? "bg-amber-100 text-amber-700" : "bg-black/[0.04] text-on-surface-variant"}`}>
              {totalAlerts}
            </span>
          </div>
          {totalAlerts === 0 ? (
            <p className="text-sm text-on-surface-variant">{t.admin.allProductsHealthy}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {alertGroups.map((g) => (
                <div key={g.label} className={`rounded-xl border p-4 ${g.items.length ? "border-amber-200 bg-amber-50/50" : "border-black/[0.06]"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <g.icon size={15} className={g.items.length ? "text-amber-600" : "text-on-surface-variant/30"} />
                    <span className="text-xs font-bold text-on-surface">{g.label}</span>
                    <span className="ml-auto text-sm font-extrabold text-on-surface">{g.items.length}</span>
                  </div>
                  {g.items.length > 0 && (
                    <ul className="space-y-0.5">
                      {g.items.slice(0, 3).map((name) => (
                        <li key={name} className="text-[11px] text-on-surface-variant truncate">{name}</li>
                      ))}
                      {g.items.length > 3 && <li className="text-[11px] text-on-surface-variant/50">+{g.items.length - 3} {t.admin.more}</li>}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions + recent products */}
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
