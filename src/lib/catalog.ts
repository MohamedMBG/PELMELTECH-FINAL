/**
 * Public catalog client. Reads products/categories from the REST API so the
 * live site always reflects what the admin panel has published — for every
 * visitor, on every device. Data functions are async; pure display helpers
 * (formatPrice, getProductPath, slugifyProductName) stay sync.
 */

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  subcategory: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  price: number | null;
  quoteOnly: boolean;
  stockStatus?: "in-stock" | "out-of-stock";
  newArrival?: boolean;
  featured: boolean;
  status: "published" | "draft";
  type: "machine" | "material" | "consumable" | "accessory" | "service";
  badge: string | null;
  badgeColor: "magenta" | "cyan" | null;
  specifications: Record<string, string>;
  ctaLabel: string;
  createdAt: string;
  updatedAt: string;
  catalogPdf?: string;
  features?: string[];
  applications?: string[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId: string | null;
  sortOrder: number;
  status: "published" | "hidden";
  icon: string | null;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.json();
}

async function allProducts(): Promise<CatalogProduct[]> {
  return fetchJson<CatalogProduct[]>("/api/products");
}

async function allCategories(): Promise<CatalogCategory[]> {
  return fetchJson<CatalogCategory[]>("/api/categories");
}

// --- Products ---

export async function getProducts(): Promise<CatalogProduct[]> {
  return (await allProducts()).filter((p) => p.status === "published");
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | undefined> {
  return (await allProducts()).find((p) => p.slug === slug);
}

export async function getRelatedProducts(product: CatalogProduct, limit = 3): Promise<CatalogProduct[]> {
  return (await allProducts())
    .filter((p) => p.subcategory === product.subcategory && p.id !== product.id && p.status === "published")
    .slice(0, limit);
}

export async function getAllSubcategories(): Promise<string[]> {
  const published = (await allProducts()).filter((p) => p.status === "published");
  return Array.from(new Set(published.map((p) => p.subcategory)));
}

// --- Categories ---

export async function getCategories(): Promise<CatalogCategory[]> {
  return (await allCategories())
    .filter((c) => c.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getParentCategories(): Promise<CatalogCategory[]> {
  return (await getCategories()).filter((c) => c.parentId === null);
}

export async function getSubcategories(parentId: string): Promise<CatalogCategory[]> {
  return (await getCategories()).filter((c) => c.parentId === parentId);
}

// --- Display helpers (pure, sync) ---

export function formatPrice(product: CatalogProduct, quoteLabel?: string): string {
  if (product.quoteOnly || product.price === null) return quoteLabel || "Request quote";
  const unit = product.specifications?.usageType;
  const formatted = `${product.price.toFixed(2)} DH`;
  return unit ? `${formatted}/${unit}` : formatted;
}

export function getProductPath(product: { slug: string }): string {
  return `/catalog/${product.slug}`;
}

export function slugifyProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
