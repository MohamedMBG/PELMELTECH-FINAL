import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";

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
  featured: boolean;
  status: "published" | "draft";
  type: "machine" | "material" | "consumable" | "accessory" | "service";
  badge: string | null;
  badgeColor: "magenta" | "cyan" | null;
  specifications: Record<string, string>;
  ctaLabel: string;
  createdAt: string;
  updatedAt: string;
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

const STORAGE_KEYS = {
  products: "pelmeltech_admin_products",
  categories: "pelmeltech_admin_categories",
};

function readCategoriesRaw(): CatalogCategory[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.categories);
      if (stored) {
        return (JSON.parse(stored) as any[]).map((c) => ({
          ...c,
          imageUrl: c.imageUrl || "",
          icon: c.icon ?? null,
        }));
      }
    } catch {}
  }
  return categoriesData as CatalogCategory[];
}

function readProductsRaw(): CatalogProduct[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.products);
      if (stored) {
        const cats = readCategoriesRaw();
        return (JSON.parse(stored) as any[]).map((p) => {
          if (p.subcategory) return p as CatalogProduct;
          const cat = cats.find((c) => c.id === p.categoryId);
          const subcategory = cat && cat.parentId ? cat.name : (p.categoryName || "");
          return {
            ...p,
            subcategory,
            badge: p.badge ?? null,
            badgeColor: p.badgeColor ?? null,
          } as CatalogProduct;
        });
      }
    } catch {}
  }
  return productsData as CatalogProduct[];
}

// --- Products ---

export function getProducts(): CatalogProduct[] {
  return readProductsRaw().filter((p) => p.status === "published");
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return readProductsRaw().find((p) => p.slug === slug);
}

export function getProductById(id: string): CatalogProduct | undefined {
  return readProductsRaw().find((p) => p.id === id);
}

export function getFeaturedProducts(): CatalogProduct[] {
  return readProductsRaw().filter((p) => p.featured && p.status === "published");
}

export function getProductsByCategory(categoryName: string): CatalogProduct[] {
  return readProductsRaw().filter(
    (p) =>
      p.status === "published" &&
      (p.categoryName === categoryName || p.subcategory === categoryName)
  );
}

export function getProductsBySubcategory(subcategory: string): CatalogProduct[] {
  return readProductsRaw().filter(
    (p) => p.status === "published" && p.subcategory === subcategory
  );
}

export function getRelatedProducts(product: CatalogProduct, limit = 3): CatalogProduct[] {
  return readProductsRaw()
    .filter((p) => p.subcategory === product.subcategory && p.id !== product.id && p.status === "published")
    .slice(0, limit);
}

export function getAllSubcategories(): string[] {
  return Array.from(new Set(readProductsRaw().filter((p) => p.status === "published").map((p) => p.subcategory)));
}

// --- Categories ---

export function getCategories(): CatalogCategory[] {
  return readCategoriesRaw()
    .filter((c) => c.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getParentCategories(): CatalogCategory[] {
  return getCategories().filter((c) => c.parentId === null);
}

export function getSubcategories(parentId: string): CatalogCategory[] {
  return getCategories().filter((c) => c.parentId === parentId);
}

export function getCategoryBySlug(slug: string): CatalogCategory | undefined {
  return readCategoriesRaw().find((c) => c.slug === slug);
}

export function getCategoryById(id: string): CatalogCategory | undefined {
  return readCategoriesRaw().find((c) => c.id === id);
}

// --- Display helpers ---

export function formatPrice(product: CatalogProduct): string {
  if (product.quoteOnly || product.price === null) return "Request quote";
  const unit = product.specifications?.usageType;
  const formatted = `$${product.price.toFixed(2)}`;
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

// --- Mega menu data derived from categories ---

export interface MegaMenuCategory {
  title: string;
  description: string;
  icon: string;
  image: string;
  items: { label: string; href: string }[];
}

export interface MegaMenuFeatured {
  title: string;
  image: string;
  items: { label: string; href: string; accent: boolean }[];
  cta: { label: string; href: string };
}

const FALLBACK_IMAGE = "/images/pelmeltech/catalog-hero.webp";

export function getMegaMenuCategories(): MegaMenuCategory[] {
  return getParentCategories().map((parent) => ({
    title: parent.name,
    description: parent.description,
    icon: parent.icon ?? "Package",
    image: parent.imageUrl || FALLBACK_IMAGE,
    items: getSubcategories(parent.id).map((sub) => ({
      label: sub.name,
      href: `/catalog?category=${sub.slug}`,
    })),
  }));
}

export function getMegaMenuFeatured(): MegaMenuFeatured {
  return {
    title: "Featured Products",
    image: "/images/pelmeltech/catalog-hero.webp",
    items: [
      { label: "Best Sellers", href: "/catalog?filter=bestsellers", accent: true },
      { label: "New Arrivals", href: "/catalog?filter=new", accent: false },
      { label: "Product Catalog", href: "/catalog", accent: false },
    ],
    cta: { label: "Request a Quote", href: "/contact" },
  };
}
