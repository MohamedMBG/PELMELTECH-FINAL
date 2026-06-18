"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, MessageCircle } from "lucide-react";
import {
  getProductBySlug,
  getProductPath,
  getRelatedProducts,
  formatPrice,
  type CatalogProduct,
} from "@/lib/catalog";
import { getProductDetail } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const [product, setProduct] = useState<CatalogProduct | null | undefined>(undefined);

  useEffect(() => {
    setProduct(getProductBySlug(slug) ?? null);
  }, [slug]);

  if (product === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-magenta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (product === null) notFound();

  const detail = getProductDetail(product);
  const relatedProducts = getRelatedProducts(product);
  const displayPrice = formatPrice(product);

  return (
    <>
      <section className="bg-surface-container-low px-4 py-16 md:px-16 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <Link
            href="/catalog"
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant transition-colors hover:text-magenta"
          >
            <ArrowLeft size={15} />
            Back to catalog
          </Link>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.18em] text-magenta">
                Technical fiche
              </span>
              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-on-surface md:text-6xl">
                {product.name}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-on-surface-variant md:text-lg">
                {product.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-magenta px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-magenta/15 transition-all hover:bg-magenta-dark active:scale-[0.98]"
                >
                  Request quote
                  <MessageCircle size={15} />
                </Link>
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-on-surface transition-all hover:border-cyan/40 hover:bg-cyan/5 active:scale-[0.98]"
                >
                  Browse products
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-3 shadow-2xl shadow-black/[0.08]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-container">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={`${product.name} product image`}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-on-surface-variant/30">
                      <FileText size={48} />
                    </div>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-surface-container-low p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/60">
                      Category
                    </p>
                    <p className="mt-1 text-sm font-bold text-on-surface">{product.subcategory}</p>
                  </div>
                  <div className="rounded-2xl bg-surface-container-low p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/60">
                      Price
                    </p>
                    <p className="mt-1 text-sm font-bold text-magenta">{displayPrice}</p>
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
                    Technical fiche
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    Key product details for specification and quote requests.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {detail.fiche.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-2xl border border-black/[0.06] bg-surface-container-low/70 p-4"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/60">
                      {row.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-on-surface">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-lg shadow-black/[0.04]">
              <h3 className="text-lg font-extrabold text-on-surface">Highlights</h3>
              <div className="mt-5 space-y-3">
                {detail.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-cyan" />
                    <p className="text-sm font-medium leading-relaxed text-on-surface-variant">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-lg shadow-black/[0.04]">
              <h3 className="text-lg font-extrabold text-on-surface">Best applications</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {detail.applications.map((application) => (
                  <span
                    key={application}
                    className="rounded-full border border-black/[0.07] bg-surface-container-low px-4 py-2 text-xs font-bold text-on-surface-variant"
                  >
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
              Related products
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={getProductPath(related)}
                  className="group rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.06]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-container">
                    <Image
                      src={related.imageUrl}
                      alt={`${related.name} product image`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/60">
                    {related.subcategory}
                  </p>
                  <h3 className="mt-1 text-base font-extrabold text-on-surface transition-colors group-hover:text-magenta">
                    {related.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
