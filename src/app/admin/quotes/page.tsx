"use client";

import { useEffect, useState, useMemo } from "react";
import { Trash2, MessageSquareQuote, Mail, Phone } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getQuotes, updateQuoteStatus, deleteQuote } from "@/lib/admin-store";
import type { QuoteRequest } from "@/lib/admin-types";
import { useLanguage } from "@/i18n";

export default function QuotesPage() {
  const { locale, t } = useLanguage();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<QuoteRequest | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    getQuotes().then(setQuotes).catch(() => {});
  }, []);

  async function refresh() {
    setQuotes(await getQuotes());
  }

  async function handleStatusChange(id: string, status: QuoteRequest["status"]) {
    await updateQuoteStatus(id, status);
    await refresh();
    setToast(t.admin.statusUpdated);
    setTimeout(() => setToast(""), 2500);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteQuote(deleteTarget.id);
    await refresh();
    setDeleteTarget(null);
    setToast(t.admin.quoteRequestArchived);
    setTimeout(() => setToast(""), 2500);
  }

  const filtered = useMemo(() => {
    if (!statusFilter) return quotes;
    return quotes.filter((q) => q.status === statusFilter);
  }, [quotes, statusFilter]);

  const counts = useMemo(() => ({
    all: quotes.length,
    new: quotes.filter((q) => q.status === "new").length,
    inProgress: quotes.filter((q) => q.status === "in-progress").length,
    done: quotes.filter((q) => q.status === "done").length,
  }), [quotes]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-FR" : locale === "ar" ? "ar-MA" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <>
      <AdminHeader title={t.admin.quoteRequests} />

      <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: `${t.admin.all} (${counts.all})`, value: "" },
            { label: `${t.admin.newLabel} (${counts.new})`, value: "new", dot: "bg-cyan" },
            { label: `${t.admin.inProgress} (${counts.inProgress})`, value: "in-progress", dot: "bg-magenta" },
            { label: `${t.admin.done} (${counts.done})`, value: "done", dot: "bg-on-surface-variant/40" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === tab.value
                  ? "bg-on-surface text-white"
                  : "bg-white border border-black/[0.08] text-on-surface-variant hover:bg-black/[0.03]"
              }`}
            >
              {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`} />}
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={MessageSquareQuote}
            title={t.admin.noQuoteRequests}
            description={quotes.length === 0 ? t.admin.quotesWillAppear : t.admin.noRequestsMatch}
          />
        ) : (
          <div className="space-y-4">
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-[#f8f9fb] text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant/60">
                    <th className="py-3 px-5">{t.admin.client}</th>
                    <th className="py-3 px-5">{t.admin.product}</th>
                    <th className="py-3 px-5">{t.admin.date}</th>
                    <th className="py-3 px-5 text-center">{t.admin.status}</th>
                    <th className="py-3 px-5 text-right">{t.admin.actions}</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-black/[0.04]">
                  {filtered.map((quote) => (
                    <tr key={quote.id} className="hover:bg-[#f8f9fb] transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-semibold text-on-surface">{quote.customerName}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1"><Mail size={12} />{quote.email}</span>
                          {quote.phone && <span className="flex items-center gap-1"><Phone size={12} />{quote.phone}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-semibold text-on-surface">{quote.productName}</p>
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{quote.message}</p>
                      </td>
                      <td className="py-4 px-5 text-on-surface-variant text-xs">
                        {formatDate(quote.createdAt)}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <select
                          value={quote.status}
                          onChange={(e) => handleStatusChange(quote.id, e.target.value as QuoteRequest["status"])}
                          className="text-xs font-semibold bg-transparent border border-black/[0.08] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
                        >
                          <option value="new">{t.admin.newLabel}</option>
                          <option value="in-progress">{t.admin.inProgress}</option>
                          <option value="done">{t.admin.done}</option>
                        </select>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setDeleteTarget(quote)}
                          className="p-2 rounded-lg hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors"
                          title={t.admin.archive}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((quote) => (
                <div key={quote.id} className="bg-white rounded-2xl border border-black/[0.06] p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-on-surface">{quote.customerName}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{quote.email}</p>
                    </div>
                    <StatusBadge status={quote.status} />
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-on-surface">{quote.productName}</p>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-3">{quote.message}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-black/[0.04]">
                    <span className="text-xs text-on-surface-variant">{formatDate(quote.createdAt)}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote.id, e.target.value as QuoteRequest["status"])}
                        className="text-xs font-semibold bg-transparent border border-black/[0.08] rounded-lg px-2 py-1.5 focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="new">{t.admin.newLabel}</option>
                        <option value="in-progress">{t.admin.inProgress}</option>
                        <option value="done">{t.admin.done}</option>
                      </select>
                      <button
                        onClick={() => setDeleteTarget(quote)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t.admin.archiveQuoteRequest}
        message={t.admin.archiveQuoteMessage.replace("{name}", deleteTarget?.customerName || "")}
        confirmLabel={t.admin.archive}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 bg-on-surface text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-50">
          {toast}
        </div>
      )}
    </>
  );
}
