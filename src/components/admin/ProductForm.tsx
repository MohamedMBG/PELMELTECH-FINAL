"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Save, ImageIcon } from "lucide-react";
import Link from "next/link";
import { getCategories, createProduct, updateProduct, getProduct } from "@/lib/admin-store";
import type { AdminProduct, AdminCategory } from "@/lib/admin-types";
import { useLanguage } from "@/i18n";

interface ProductFormProps {
  productId?: string;
}

type FormData = {
  name: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  price: string;
  quoteOnly: boolean;
  stockStatus: AdminProduct["stockStatus"];
  newArrival: boolean;
  featured: boolean;
  status: "published" | "draft";
  type: AdminProduct["type"];
  ctaLabel: AdminProduct["ctaLabel"];
  printWidth: string;
  printSpeed: string;
  resolution: string;
  inkType: string;
  materialCompatibility: string;
  usageType: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  categoryId: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  price: "",
  quoteOnly: false,
  stockStatus: "in-stock",
  newArrival: false,
  featured: false,
  status: "draft",
  type: "machine",
  ctaLabel: "Request Quote",
  printWidth: "",
  printSpeed: "",
  resolution: "",
  inkType: "",
  materialCompatibility: "",
  usageType: "",
};

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const isEdit = !!productId;

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    if (productId) {
      getProduct(productId).then((product) => {
      if (!product) {
        router.replace("/admin/products");
        return;
      }
      setForm({
        name: product.name,
        categoryId: product.categoryId,
        shortDescription: product.shortDescription,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price !== null ? product.price.toString() : "",
        quoteOnly: product.quoteOnly,
        stockStatus: product.stockStatus ?? "in-stock",
        newArrival: product.newArrival ?? false,
        featured: product.featured,
        status: product.status,
        type: product.type,
        ctaLabel: product.ctaLabel,
        printWidth: product.specifications.printWidth || "",
        printSpeed: product.specifications.printSpeed || "",
        resolution: product.specifications.resolution || "",
        inkType: product.specifications.inkType || "",
        materialCompatibility: product.specifications.materialCompatibility || "",
        usageType: product.specifications.usageType || "",
      });
      }).catch(() => router.replace("/admin/products"));
    }
  }, [productId, router]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = t.admin.productNameRequired;
    if (!form.categoryId) errs.categoryId = t.admin.categoryRequired;
    if (!form.quoteOnly && form.price && isNaN(parseFloat(form.price))) {
      errs.price = t.admin.validPriceRequired;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const category = categories.find((c) => c.id === form.categoryId);
    const productData = {
      name: form.name.trim(),
      categoryId: form.categoryId,
      categoryName: category?.name || "",
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      gallery: [] as string[],
      price: form.quoteOnly ? null : (form.price ? parseFloat(form.price) : null),
      quoteOnly: form.quoteOnly,
      stockStatus: form.stockStatus,
      newArrival: form.newArrival,
      featured: form.featured,
      status: form.status,
      type: form.type,
      specifications: {
        printWidth: form.printWidth || undefined,
        printSpeed: form.printSpeed || undefined,
        resolution: form.resolution || undefined,
        inkType: form.inkType || undefined,
        materialCompatibility: form.materialCompatibility || undefined,
        usageType: form.usageType || undefined,
      },
      ctaLabel: form.ctaLabel,
    };

    try {
      if (isEdit && productId) {
        await updateProduct(productId, productData);
      } else {
        await createProduct(productData);
      }
    } catch {
      setSaving(false);
      setToast(t.admin.saveFailed);
      setTimeout(() => setToast(""), 2500);
      return;
    }

    setToast(isEdit ? t.admin.productUpdated : t.admin.productCreated);
    setTimeout(() => {
      setSaving(false);
      router.push("/admin/products");
    }, 600);
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto max-w-4xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <ArrowLeft size={14} />
        {t.admin.backToProducts}
      </Link>

      {/* Basic Info */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-base font-bold text-on-surface mb-5 pb-3 border-b border-black/[0.04]">
          {t.admin.basicInformation}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">{t.admin.productName} *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Premium Vinyl Banner"
              className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all ${
                errors.name ? "border-red-400 focus:ring-red-200" : "border-black/[0.08]"
              }`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">{t.admin.category} *</label>
            <select
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer transition-all ${
                errors.categoryId ? "border-red-400 focus:ring-red-200" : "border-black/[0.08]"
              }`}
            >
              <option value="">{t.admin.selectCategory}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">{t.admin.productType}</label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value as AdminProduct["type"])}
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
            >
              <option value="machine">{t.admin.printingMachine}</option>
              <option value="material">{t.admin.printingMaterial}</option>
              <option value="consumable">{t.admin.consumable}</option>
              <option value="accessory">{t.admin.accessory}</option>
              <option value="service">{t.admin.serviceRelated}</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">{t.admin.ctaLabel}</label>
            <select
              value={form.ctaLabel}
              onChange={(e) => update("ctaLabel", e.target.value as AdminProduct["ctaLabel"])}
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
            >
              <option value="Request Quote">{t.admin.requestQuote}</option>
              <option value="View Details">{t.common.viewDetails}</option>
              <option value="Contact Sales">{t.admin.contactSales}</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">{t.admin.shortDescription}</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              placeholder="Brief summary for listings"
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">{t.admin.fullDescription}</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Detailed product information..."
              rows={4}
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all resize-y"
            />
          </div>
        </div>
      </section>

      {/* Product Image */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-base font-bold text-on-surface mb-5 pb-3 border-b border-black/[0.04]">
          {t.admin.productImage}
        </h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">{t.admin.imageUrl}</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="/images/pelmeltech/product-example.webp"
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all"
            />
            <p className="text-[11px] text-on-surface-variant/50">
              {t.admin.imageUrlHelp}
            </p>
          </div>
          {form.imageUrl && (
            <div className="w-32 h-24 rounded-lg border border-black/[0.06] overflow-hidden bg-surface-container">
              <Image
                src={form.imageUrl}
                alt={t.admin.productPreview}
                width={128}
                height={96}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
          {!form.imageUrl && (
            <div className="w-32 h-24 rounded-lg border-2 border-dashed border-black/[0.1] flex flex-col items-center justify-center text-on-surface-variant/30">
              <ImageIcon size={20} />
              <span className="text-[10px] mt-1">{t.admin.noImage}</span>
            </div>
          )}
        </div>
      </section>

      {/* Pricing & Status */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-base font-bold text-on-surface mb-5 pb-3 border-b border-black/[0.04]">
          {t.admin.pricingStatus}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">{t.admin.basePrice}</label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="0.00"
              disabled={form.quoteOnly}
              className={`w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all ${
                form.quoteOnly ? "opacity-50 cursor-not-allowed" : ""
              } ${errors.price ? "border-red-400" : ""}`}
            />
            {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">{t.admin.status}</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value as "published" | "draft")}
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
            >
              <option value="published">{t.admin.published}</option>
              <option value="draft">{t.admin.draft}</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">{t.admin.stock}</label>
            <select
              value={form.stockStatus}
              onChange={(e) => update("stockStatus", e.target.value as AdminProduct["stockStatus"])}
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
            >
              <option value="in-stock">{t.admin.inStock}</option>
              <option value="out-of-stock">{t.admin.outOfStock}</option>
            </select>
          </div>
          <div className="flex items-center gap-4 md:col-span-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.quoteOnly}
                onChange={(e) => update("quoteOnly", e.target.checked)}
                className="w-4 h-4 rounded border-black/[0.15] text-cyan-dark focus:ring-cyan/30"
              />
              <span className="text-sm text-on-surface">{t.admin.quoteBasedPricing}</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.newArrival}
                onChange={(e) => update("newArrival", e.target.checked)}
                className="w-4 h-4 rounded border-black/[0.15] text-cyan-dark focus:ring-cyan/30"
              />
              <span className="text-sm text-on-surface">{t.admin.newArrival}</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="w-4 h-4 rounded border-black/[0.15] text-magenta focus:ring-magenta/30"
              />
              <span className="text-sm text-on-surface">{t.admin.featuredProduct}</span>
            </label>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-base font-bold text-on-surface mb-1">{t.admin.specifications}</h2>
        <p className="text-xs text-on-surface-variant mb-5 pb-3 border-b border-black/[0.04]">{t.admin.optionalTechnicalDetails}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {([
            ["printWidth", t.admin.printWidth, "e.g. 1600mm"],
            ["printSpeed", t.admin.printSpeed, "e.g. 45 sqm/hr"],
            ["resolution", t.admin.resolution, "e.g. 1440 dpi"],
            ["inkType", t.admin.inkType, "e.g. Eco-solvent, UV"],
            ["materialCompatibility", t.admin.materialCompatibility, "e.g. Vinyl, banner, fabric"],
            ["usageType", t.admin.usageType, "e.g. Indoor, outdoor, both"],
          ] as const).map(([key, label, placeholder]) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">{label}</label>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pb-8">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-black/5 transition-colors"
        >
          {t.admin.cancel}
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-on-surface text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-on-surface/90 transition-colors disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? t.admin.saving : isEdit ? t.admin.updateProduct : t.admin.createProductButton}
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-on-surface text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-50">
          {toast}
        </div>
      )}
    </form>
  );
}
