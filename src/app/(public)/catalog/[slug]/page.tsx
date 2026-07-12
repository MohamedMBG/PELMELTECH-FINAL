"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileText, MessageCircle } from "lucide-react";
import {
  getProductBySlug,
  getProductPath,
  getRelatedProducts,
  formatPrice,
  type CatalogProduct,
} from "@/lib/catalog";
import { getProductDetail } from "@/lib/products";
import { useLanguage } from "@/i18n";
import { localizeProduct } from "@/lib/localized-catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const [product, setProduct] = useState<CatalogProduct | null | undefined>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<CatalogProduct[]>([]);
  const { locale, t } = useLanguage();

  const labels = {
    fr: {
      whatsappCTA: "Discuter sur WhatsApp",
      whatsappMsg: (name: string) => `Bonjour, je suis intéressé par le produit : ${name}. Pouvez-vous me donner plus d'informations ?`,
      downloadFiche: "Fiche technique (PDF)",
    },
    en: {
      whatsappCTA: "Chat on WhatsApp",
      whatsappMsg: (name: string) => `Hello, I am interested in the product: ${name}. Can you please provide more information?`,
      downloadFiche: "Technical sheet (PDF)",
    },
    ar: {
      whatsappCTA: "اتصل بنا على واتساب",
      whatsappMsg: (name: string) => `مرحباً، أنا مهتم بالمنتج: ${name}. هل يمكنك تزويدي بمزيد من المعلومات؟`,
      downloadFiche: "البطاقة التقنية (PDF)",
    },
  }[locale] || {
    whatsappCTA: "Discuter sur WhatsApp",
    whatsappMsg: (name: string) => `Bonjour, je suis intéressé par le produit : ${name}. Pouvez-vous me donner plus d'informations ?`,
    downloadFiche: "Fiche technique (PDF)",
  };

  void labels;

  useEffect(() => {
    let active = true;
    getProductBySlug(slug)
      .then(async (p) => {
        if (!active) return;
        if (!p) {
          setProduct(null);
          return;
        }
        setProduct(p);
        const rel = await getRelatedProducts(p);
        if (active) setRelatedProducts(rel);
      })
      .catch(() => {
        if (active) setProduct(null);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (product === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-magenta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (product === null) notFound();

  const displayProduct = localizeProduct(product, locale);
  const detail = getProductDetail(displayProduct, locale);
  const displayPrice = formatPrice(displayProduct, t.productDetail.requestQuote);
  const whatsappMessage = t.productDetail.whatsappMessage.replace("{name}", displayProduct.name);

  return (
    <>
      <section className="bg-surface-container-low px-4 py-16 md:px-16 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href="/catalog"
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant transition-colors hover:text-magenta"
          >
            <ArrowLeft size={15} className="rtl:rotate-180" />
            {t.productDetail.backToCatalog}
          </Link>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.18em] text-magenta">
                {t.productDetail.technicalFiche}
              </span>
              <h1 className="max-w-2xl text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-on-surface md:text-6xl">
                {displayProduct.name}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-on-surface-variant md:text-lg">
                {displayProduct.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/contact?product=${encodeURIComponent(displayProduct.name)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-magenta px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-magenta/15 transition-all hover:bg-magenta-dark active:scale-[0.98]"
                >
                  {t.productDetail.requestQuote}
                  <MessageCircle size={15} />
                </Link>

                <a
                  href={`https://wa.me/212660400881?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-emerald-600/15 transition-all hover:bg-emerald-700 active:scale-[0.98]"
                >
                  {t.productDetail.whatsappCTA}
                  <MessageCircle size={15} />
                </a>

                {product.catalogPdf && (
                  <a
                    href={product.catalogPdf}
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-on-surface transition-all hover:border-cyan/40 hover:bg-cyan/5 active:scale-[0.98]"
                  >
                    {t.productDetail.downloadFiche}
                    <FileText size={15} />
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-3 shadow-2xl shadow-black/[0.08]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={t.productDetail.productImageAlt.replace("{name}", displayProduct.name)} fill priority className="object-contain p-4" sizes="(max-width: 1024px) 100vw, 50vw" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-on-surface-variant/30">
                      <FileText size={48} />
                    </div>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {product.newArrival && (
                    <div className="col-span-2 rounded-2xl bg-cyan/10 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-dark">
                        {t.catalog.newArrival}
                      </p>
                    </div>
                  )}
                  <div className="rounded-2xl bg-surface-container-low p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/60">
                      {t.productDetail.category}
                    </p>
                    <p className="mt-1 text-sm font-bold text-on-surface">{displayProduct.subcategory}</p>
                  </div>
                  <div className="rounded-2xl bg-surface-container-low p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/60">
                      {t.productDetail.price}
                    </p>
                    <p className="mt-1 text-sm font-bold text-magenta">{displayPrice}</p>
                  </div>
                  <div className="col-span-2 rounded-2xl bg-surface-container-low p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/60">
                      {t.productDetail.stock}
                    </p>
                    <p className={`mt-1 text-sm font-bold ${
                      product.stockStatus === "out-of-stock" ? "text-red-500" : "text-cyan-dark"
                    }`}>
                      {product.stockStatus === "out-of-stock" ? t.catalog.outOfStock : t.catalog.inStock}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-16 md:py-24">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl shadow-black/[0.04] md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-magenta/10 text-magenta">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">
                    {t.productDetail.technicalFiche}
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    {t.productDetail.ficheDescription}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {detail.fiche.map((row) => (
                  <div key={row.label} className="rounded-2xl border border-black/[0.06] bg-surface-container-low/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/60">{row.label}</p>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-on-surface">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-lg shadow-black/[0.04]">
              <h3 className="text-lg font-extrabold text-on-surface">{t.productDetail.highlights}</h3>
              <div className="mt-5 space-y-3">
                {detail.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-cyan" />
                    <p className="text-sm font-medium leading-relaxed text-on-surface-variant">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-lg shadow-black/[0.04]">
              <h3 className="text-lg font-extrabold text-on-surface">{t.productDetail.bestApplications}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {detail.applications.map((application) => (
                  <span key={application} className="rounded-full border border-black/[0.07] bg-surface-container-low px-4 py-2 text-xs font-bold text-on-surface-variant">
                    {application}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-surface-container-low px-4 py-16 md:px-16 md:py-20">
          <div className="mx-auto max-w-[1280px]">
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
              {t.productDetail.relatedProducts}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {relatedProducts.map((related) => {
                const displayRelated = localizeProduct(related, locale);
                return (
                  <Link
                    key={related.id}
                    href={getProductPath(related)}
                    className="group rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.06]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-container">
                      <Image src={related.imageUrl} alt={t.productDetail.productImageAlt.replace("{name}", displayRelated.name)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/60">{displayRelated.subcategory}</p>
                    <h3 className="mt-1 text-base font-extrabold text-on-surface transition-colors group-hover:text-magenta">{displayRelated.name}</h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
