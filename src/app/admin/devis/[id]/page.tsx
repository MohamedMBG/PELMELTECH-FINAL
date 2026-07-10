"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getDevis, updateDevis } from "@/lib/admin-store";
import { lineAmount, devisSubtotal, devisTax, devisTotal, devisBuyTotal } from "@/lib/devis";
import type { Devis } from "@/lib/admin-types";
import { useLanguage } from "@/i18n";

export default function DevisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, t } = useLanguage();
  const d = t.admin.devis;
  const [devis, setDevis] = useState<Devis | null>(null);

  useEffect(() => {
    getDevis(id).then(setDevis).catch(() => setDevis(null));
  }, [id]);

  async function handleStatus(status: Devis["status"]) {
    if (!devis) return;
    setDevis({ ...devis, status });
    await updateDevis(devis.id, { status }).catch(() => {});
  }

  if (!devis) {
    return (
      <>
        <AdminHeader title={d.title} />
        <div className="flex-1 p-8 text-sm text-on-surface-variant">…</div>
      </>
    );
  }

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString(
      locale === "fr" ? "fr-FR" : locale === "ar" ? "ar-MA" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );

  const subtotal = devisSubtotal(devis);
  const tax = devisTax(devis);
  const total = devisTotal(devis);
  const buyItems = devis.buyItems ?? [];
  const buyTotal = devisBuyTotal(devis);

  return (
    <>
      <AdminHeader
        title={devis.number}
        actions={
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-on-surface text-white px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase hover:bg-on-surface/90 transition-colors"
          >
            <Printer size={16} />
            {d.print}
          </button>
        }
      />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            href="/admin/devis"
            className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface"
          >
            <ArrowLeft size={16} />
            {d.backToDevis}
          </Link>
          <select
            value={devis.status}
            onChange={(e) => handleStatus(e.target.value as Devis["status"])}
            className="text-xs font-semibold bg-white border border-black/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan/30 cursor-pointer"
          >
            <option value="draft">{d.statusDraft}</option>
            <option value="sent">{d.statusSent}</option>
            <option value="accepted">{d.statusAccepted}</option>
          </select>
        </div>

        {/* Printable document */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-6 md:p-10 max-w-3xl mx-auto print:border-0 print:rounded-none print:p-0 print:max-w-none">
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-xl font-extrabold tracking-tighter text-on-surface">
                PELMEL<span className="text-cyan">TECH</span>
              </p>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                88 Print Avenue, Industrial Zone West<br />
                Design District, CA 90210<br />
                projects@pelmeltech.com · +1 (555) 012-3456
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold tracking-widest text-magenta">{d.quotation}</p>
              <p className="text-sm font-mono font-semibold text-on-surface mt-1">{devis.number}</p>
              <p className="text-xs text-on-surface-variant mt-1">{formatDate(devis.createdAt)}</p>
              {devis.createdByName && (
                <p className="text-xs text-on-surface-variant mt-1">
                  {d.preparedBy}: <span className="font-semibold">{devis.createdByName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-on-surface-variant/60 mb-1">
              {d.billTo}
            </p>
            <p className="font-bold text-on-surface">{devis.customerName}</p>
            {devis.company && <p className="text-sm text-on-surface-variant">{devis.company}</p>}
            {devis.address && <p className="text-sm text-on-surface-variant">{devis.address}</p>}
            {devis.email && <p className="text-sm text-on-surface-variant">{devis.email}</p>}
            {devis.phone && <p className="text-sm text-on-surface-variant">{devis.phone}</p>}
          </div>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b-2 border-on-surface text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant/70">
                <th className="py-2 text-left">{d.itemDescription}</th>
                <th className="py-2 text-right w-16">{d.quantity}</th>
                <th className="py-2 text-right w-28">{d.unitPrice}</th>
                <th className="py-2 text-right w-28">{d.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {devis.items.map((it, i) => (
                <tr key={i}>
                  <td className="py-2.5 text-on-surface">{it.description}</td>
                  <td className="py-2.5 text-right text-on-surface-variant">{it.quantity}</td>
                  <td className="py-2.5 text-right text-on-surface-variant">${it.unitPrice.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-semibold text-on-surface">${lineAmount(it).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{d.subtotal}</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{d.tax} ({devis.taxRate}%)</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-on-surface text-base">
                <span className="font-bold">{d.total}</span>
                <span className="font-extrabold text-magenta">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {buyItems.length > 0 && (
            <div className="mt-10">
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-on-surface-variant/60 mb-2">
                {d.buyItems}
              </p>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b-2 border-on-surface text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant/70">
                    <th className="py-2 text-left">{d.itemDescription}</th>
                    <th className="py-2 text-right w-16">{d.quantity}</th>
                    <th className="py-2 text-right w-28">{d.unitPrice}</th>
                    <th className="py-2 text-right w-28">{d.amount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.06]">
                  {buyItems.map((it, i) => (
                    <tr key={i}>
                      <td className="py-2.5 text-on-surface">{it.description}</td>
                      <td className="py-2.5 text-right text-on-surface-variant">{it.quantity}</td>
                      <td className="py-2.5 text-right text-on-surface-variant">${it.unitPrice.toFixed(2)}</td>
                      <td className="py-2.5 text-right font-semibold text-on-surface">${lineAmount(it).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end">
                <div className="w-full max-w-xs flex justify-between text-sm border-t-2 border-on-surface pt-2">
                  <span className="font-bold">{d.buySubtotal}</span>
                  <span className="font-extrabold text-on-surface">${buyTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {devis.notes && (
            <div className="mt-10 pt-4 border-t border-black/[0.06]">
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-on-surface-variant/60 mb-1">
                {d.notes}
              </p>
              <p className="text-sm text-on-surface-variant whitespace-pre-line">{devis.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
