"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Save, ImageIcon } from "lucide-react";
import Link from "next/link";
import { getCategories, createProduct, updateProduct, getProduct } from "@/lib/admin-store";
import type { AdminProduct, AdminCategory } from "@/lib/admin-types";

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
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const isEdit = !!productId;

  useEffect(() => {
    setCategories(getCategories());
    if (productId) {
      const product = getProduct(productId);
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
    }
  }, [productId, router]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.categoryId) errs.categoryId = "Category is required";
    if (!form.quoteOnly && form.price && isNaN(parseFloat(form.price))) {
      errs.price = "Enter a valid price";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
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

    if (isEdit && productId) {
      updateProduct(productId, productData);
    } else {
      createProduct(productData);
    }

    setToast(isEdit ? "Product updated" : "Product created");
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
        Back to Products
      </Link>

      {/* Basic Info */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-base font-bold text-on-surface mb-5 pb-3 border-b border-black/[0.04]">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Product Name *</label>
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
            <label className="text-xs font-semibold text-on-surface-variant">Category *</label>
            <select
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer transition-all ${
                errors.categoryId ? "border-red-400 focus:ring-red-200" : "border-black/[0.08]"
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Product Type</label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value as AdminProduct["type"])}
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
            >
              <option value="machine">Printing Machine</option>
              <option value="material">Printing Material</option>
              <option value="consumable">Consumable</option>
              <option value="accessory">Accessory</option>
              <option value="service">Service-related</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">CTA Label</label>
            <select
              value={form.ctaLabel}
              onChange={(e) => update("ctaLabel", e.target.value as AdminProduct["ctaLabel"])}
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
            >
              <option value="Request Quote">Request Quote</option>
              <option value="View Details">View Details</option>
              <option value="Contact Sales">Contact Sales</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Short Description</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              placeholder="Brief summary for listings"
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Full Description</label>
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
          Product Image
        </h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Image URL</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="/images/pelmeltech/product-example.webp"
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all"
            />
            <p className="text-[11px] text-on-surface-variant/50">
              Use a path from /images or an external URL. Real upload requires backend integration.
            </p>
          </div>
          {form.imageUrl && (
            <div className="w-32 h-24 rounded-lg border border-black/[0.06] overflow-hidden bg-surface-container">
              <Image
                src={form.imageUrl}
                alt="Product preview"
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
              <span className="text-[10px] mt-1">No image</span>
            </div>
          )}
        </div>
      </section>

      {/* Pricing & Status */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-base font-bold text-on-surface mb-5 pb-3 border-b border-black/[0.04]">
          Pricing & Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Base Price ($)</label>
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
            <label className="text-xs font-semibold text-on-surface-variant">Status</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value as "published" | "draft")}
              className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
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
              <span className="text-sm text-on-surface">Quote-based pricing</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="w-4 h-4 rounded border-black/[0.15] text-magenta focus:ring-magenta/30"
              />
              <span className="text-sm text-on-surface">Featured product</span>
            </label>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="bg-white rounded-2xl border border-black/[0.06] p-6">
        <h2 className="text-base font-bold text-on-surface mb-1">Specifications</h2>
        <p className="text-xs text-on-surface-variant mb-5 pb-3 border-b border-black/[0.04]">Optional technical details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {([
            ["printWidth", "Print Width", "e.g. 1600mm"],
            ["printSpeed", "Print Speed", "e.g. 45 sqm/hr"],
            ["resolution", "Resolution", "e.g. 1440 dpi"],
            ["inkType", "Ink Type", "e.g. Eco-solvent, UV"],
            ["materialCompatibility", "Material Compatibility", "e.g. Vinyl, banner, fabric"],
            ["usageType", "Usage Type", "e.g. Indoor, outdoor, both"],
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
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-on-surface text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-on-surface/90 transition-colors disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
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
