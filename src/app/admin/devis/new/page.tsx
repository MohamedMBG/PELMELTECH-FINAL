"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getProducts, createDevis } from "@/lib/admin-store";
import { lineAmount } from "@/lib/devis";
import type { AdminProduct, DevisItem } from "@/lib/admin-types";
import { useLanguage } from "@/i18n";

const emptyItem: DevisItem = { description: "", quantity: 1, unitPrice: 0 };

export default function NewDevisPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const d = t.admin.devis;

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [taxRate, setTaxRate] = useState(20);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DevisItem[]>([{ ...emptyItem }]);
  const [buyItems, setBuyItems] = useState<DevisItem[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {});
  }, []);

  function updateItem(idx: number, patch: Partial<DevisItem>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function applyProduct(idx: number, productId: string) {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    updateItem(idx, { description: p.name, unitPrice: typeof p.price === "number" ? p.price : 0 });
  }

  function updateBuyItem(idx: number, patch: Partial<DevisItem>) {
    setBuyItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  const subtotal = items.reduce((s, it) => s + lineAmount(it), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  const buyTotal = buyItems.reduce((s, it) => s + lineAmount(it), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!customerName.trim()) return setError(d.customerRequired);
    const cleanItems = items.filter((it) => it.description.trim());
    if (cleanItems.length === 0) return setError(d.itemRequired);

    setSaving(true);
    try {
      const devis = await createDevis({
        customerName: customerName.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        items: cleanItems,
        buyItems: buyItems.filter((it) => it.description.trim()),
        taxRate,
        notes: notes.trim(),
      });
      router.push(`/admin/devis/${devis.id}`);
    } catch {
      setError(t.admin.saveFailed);
      setSaving(false);
    }
  }

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-black/[0.08] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30";

  return (
    <>
      <AdminHeader title={d.newDevis} />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Link
          href="/admin/devis"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface mb-6"
        >
          <ArrowLeft size={16} />
          {d.backToDevis}
        </Link>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          {/* Customer */}
          <section className="bg-white rounded-2xl border border-black/[0.06] p-5 md:p-6 space-y-4">
            <h2 className="text-sm font-bold text-on-surface">{d.billTo}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold text-on-surface-variant">{d.customer} *</span>
                <input className={inputCls} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-on-surface-variant">{d.company}</span>
                <input className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-on-surface-variant">{t.contact.email}</span>
                <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-on-surface-variant">{t.contact.phone}</span>
                <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label className="block md:col-span-2">
                <span className="text-xs font-semibold text-on-surface-variant">{d.address}</span>
                <input className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} />
              </label>
            </div>
          </section>

          {/* Line items */}
          <section className="bg-white rounded-2xl border border-black/[0.06] p-5 md:p-6 space-y-3">
            <h2 className="text-sm font-bold text-on-surface">{d.lineItems}</h2>

            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-12 md:col-span-5 space-y-1">
                  <input
                    className={inputCls}
                    placeholder={d.itemDescription}
                    value={it.description}
                    onChange={(e) => updateItem(idx, { description: e.target.value })}
                  />
                  <select
                    className="w-full px-2 py-1 rounded-lg border border-black/[0.06] bg-[#f8f9fb] text-xs text-on-surface-variant focus:outline-none"
                    value=""
                    onChange={(e) => applyProduct(idx, e.target.value)}
                  >
                    <option value="">{d.pickProduct}</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3 md:col-span-2">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    className={inputCls}
                    placeholder={d.quantity}
                    value={it.quantity}
                    onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className={inputCls}
                    placeholder={d.unitPrice}
                    value={it.unitPrice}
                    onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="col-span-4 md:col-span-2 py-2 text-sm font-semibold text-on-surface text-right">
                  ${lineAmount(it).toFixed(2)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                    disabled={items.length === 1}
                    className="p-2 rounded-lg hover:bg-red-50 text-on-surface-variant hover:text-red-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setItems((prev) => [...prev, { ...emptyItem }])}
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-dark hover:text-cyan mt-1"
            >
              <Plus size={16} />
              {d.addLine}
            </button>
          </section>

          {/* Buy / purchases */}
          <section className="bg-white rounded-2xl border border-black/[0.06] p-5 md:p-6 space-y-3">
            <h2 className="text-sm font-bold text-on-surface">{d.buyItems}</h2>

            {buyItems.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-12 md:col-span-5">
                  <input
                    className={inputCls}
                    placeholder={d.itemDescription}
                    value={it.description}
                    onChange={(e) => updateBuyItem(idx, { description: e.target.value })}
                  />
                </div>
                <div className="col-span-3 md:col-span-2">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    className={inputCls}
                    placeholder={d.quantity}
                    value={it.quantity}
                    onChange={(e) => updateBuyItem(idx, { quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className={inputCls}
                    placeholder={d.unitPrice}
                    value={it.unitPrice}
                    onChange={(e) => updateBuyItem(idx, { unitPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="col-span-4 md:col-span-2 py-2 text-sm font-semibold text-on-surface text-right">
                  ${lineAmount(it).toFixed(2)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setBuyItems((prev) => prev.filter((_, i) => i !== idx))}
                    className="p-2 rounded-lg hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setBuyItems((prev) => [...prev, { ...emptyItem }])}
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-dark hover:text-cyan mt-1"
            >
              <Plus size={16} />
              {d.addBuy}
            </button>

            {buyItems.length > 0 && (
              <div className="flex justify-between pt-3 border-t border-black/[0.06] text-sm">
                <span className="text-on-surface-variant">{d.buySubtotal}</span>
                <span className="font-semibold">{buyTotal.toFixed(2)} DH</span>
              </div>
            )}
          </section>

          {/* Totals + notes */}
          <section className="bg-white rounded-2xl border border-black/[0.06] p-5 md:p-6 grid md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-xs font-semibold text-on-surface-variant">{d.notes}</span>
              <textarea
                rows={4}
                className={inputCls}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{d.subtotal}</span>
                <span className="font-semibold">{subtotal.toFixed(2)} DH</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-on-surface-variant flex items-center gap-2">
                  {d.tax}
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    className="w-16 px-2 py-1 rounded-lg border border-black/[0.08] text-xs"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                  %
                </span>
                <span className="font-semibold">{tax.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-black/[0.06] text-base">
                <span className="font-bold">{d.total}</span>
                <span className="font-extrabold text-magenta">{total.toFixed(2)} DH</span>
              </div>
            </div>
          </section>

          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-on-surface text-white px-6 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase hover:bg-on-surface/90 disabled:opacity-50 transition-colors"
            >
              {saving ? t.admin.saving : t.admin.create}
            </button>
            <Link
              href="/admin/devis"
              className="px-6 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase text-on-surface-variant hover:bg-black/[0.04] transition-colors"
            >
              {t.admin.cancel}
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
