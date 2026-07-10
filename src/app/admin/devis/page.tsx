"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, Trash2, Eye } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getDevisList, deleteDevis } from "@/lib/admin-store";
import { devisTotal } from "@/lib/devis";
import type { Devis } from "@/lib/admin-types";
import { useLanguage } from "@/i18n";

export default function DevisListPage() {
  const { locale, t } = useLanguage();
  const [list, setList] = useState<Devis[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Devis | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    getDevisList().then(setList).catch(() => {});
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteDevis(deleteTarget.id);
    setList(await getDevisList());
    setDeleteTarget(null);
    setToast(t.admin.devis.devisDeleted);
    setTimeout(() => setToast(""), 2500);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(
      locale === "fr" ? "fr-FR" : locale === "ar" ? "ar-MA" : "en-US",
      { month: "short", day: "numeric", year: "numeric" }
    );
  }

  const statusLabel: Record<Devis["status"], string> = {
    draft: t.admin.devis.statusDraft,
    sent: t.admin.devis.statusSent,
    accepted: t.admin.devis.statusAccepted,
  };

  return (
    <>
      <AdminHeader
        title={t.admin.devis.title}
        actions={
          <Link
            href="/admin/devis/new"
            className="inline-flex items-center gap-2 bg-on-surface text-white px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase hover:bg-on-surface/90 transition-colors"
          >
            <Plus size={16} />
            {t.admin.devis.newDevis}
          </Link>
        }
      />

      <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        {list.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t.admin.devis.noDevis}
            description={t.admin.devis.devisWillAppear}
            actionLabel={t.admin.devis.newDevis}
            actionHref="/admin/devis/new"
          />
        ) : (
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/[0.06] bg-[#f8f9fb] text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant/60">
                  <th className="py-3 px-5">{t.admin.devis.number}</th>
                  <th className="py-3 px-5">{t.admin.client}</th>
                  <th className="py-3 px-5">{t.admin.devis.preparedBy}</th>
                  <th className="py-3 px-5">{t.admin.devis.date}</th>
                  <th className="py-3 px-5 text-center">{t.admin.status}</th>
                  <th className="py-3 px-5 text-right">{t.admin.devis.total}</th>
                  <th className="py-3 px-5 text-right">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-black/[0.04]">
                {list.map((d) => (
                  <tr key={d.id} className="hover:bg-[#f8f9fb] transition-colors">
                    <td className="py-4 px-5 font-mono text-xs font-semibold text-on-surface">{d.number}</td>
                    <td className="py-4 px-5">
                      <p className="font-semibold text-on-surface">{d.customerName}</p>
                      {d.company && <p className="text-xs text-on-surface-variant">{d.company}</p>}
                    </td>
                    <td className="py-4 px-5 text-on-surface-variant text-xs">{d.createdByName || "—"}</td>
                    <td className="py-4 px-5 text-on-surface-variant text-xs">{formatDate(d.createdAt)}</td>
                    <td className="py-4 px-5 text-center">
                      <span className="text-xs font-semibold text-on-surface-variant">{statusLabel[d.status]}</span>
                    </td>
                    <td className="py-4 px-5 text-right font-bold text-magenta">
                      ${devisTotal(d).toFixed(2)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/devis/${d.id}`}
                          className="p-2 rounded-lg hover:bg-black/[0.04] text-on-surface-variant hover:text-cyan-dark transition-colors"
                          title={t.admin.view}
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(d)}
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
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t.admin.devis.deleteDevis}
        message={t.admin.devis.deleteDevisMessage.replace("{number}", deleteTarget?.number || "")}
        confirmLabel={t.admin.delete}
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
