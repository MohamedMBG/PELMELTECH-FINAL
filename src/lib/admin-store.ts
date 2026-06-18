/**
 * Demo localStorage-based store for admin panel.
 * TODO: Replace with real API calls when backend is available.
 */

import { AdminProduct, AdminCategory, QuoteRequest } from "./admin-types";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";

const STORAGE_KEYS = {
  products: "pelmeltech_admin_products",
  categories: "pelmeltech_admin_categories",
  quotes: "pelmeltech_admin_quotes",
  seeded: "pelmeltech_admin_seeded",
  seedVersion: "pelmeltech_admin_seed_version",
} as const;

const SEED_VERSION = "2";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function now(): string {
  return new Date().toISOString();
}

function migrateData(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(STORAGE_KEYS.seedVersion) === SEED_VERSION) return;
  if (!localStorage.getItem(STORAGE_KEYS.seeded)) return;

  const cats = readStoredCategories();
  const prods = readStoredProducts();

  const migratedCats = cats.map((c: any) => ({ ...c, icon: c.icon ?? null }));
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(migratedCats));

  const migratedProds = prods.map((p: any) => {
    if (p.subcategory) return p;
    const cat = migratedCats.find((c: any) => c.id === p.categoryId);
    return {
      ...p,
      subcategory: cat && cat.parentId ? cat.name : (p.categoryName || ""),
      badge: p.badge ?? null,
      badgeColor: p.badgeColor ?? null,
    };
  });
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(migratedProds));
  localStorage.setItem(STORAGE_KEYS.seedVersion, SEED_VERSION);
}

function readStoredProducts(): any[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.products) || "[]"); } catch { return []; }
}

function readStoredCategories(): any[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.categories) || "[]"); } catch { return []; }
}

function seedData(): void {
  if (typeof window === "undefined") return;
  migrateData();
  if (localStorage.getItem(STORAGE_KEYS.seeded)) return;

  const ts = now();

  const categories = categoriesData.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl,
    parentId: c.parentId,
    sortOrder: c.sortOrder,
    status: c.status as "published" | "hidden",
    icon: (c as any).icon ?? null,
    createdAt: ts,
    updatedAt: ts,
  }));

  const products = productsData.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    categoryId: p.categoryId,
    categoryName: p.categoryName,
    subcategory: (p as any).subcategory ?? p.categoryName,
    shortDescription: p.shortDescription,
    description: p.description,
    imageUrl: p.imageUrl,
    gallery: p.gallery,
    price: p.price,
    quoteOnly: p.quoteOnly,
    featured: p.featured,
    status: p.status as "published" | "draft",
    type: p.type as AdminProduct["type"],
    badge: (p as any).badge ?? null,
    badgeColor: (p as any).badgeColor ?? null,
    specifications: p.specifications as AdminProduct["specifications"],
    ctaLabel: p.ctaLabel as AdminProduct["ctaLabel"],
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  const quotes: QuoteRequest[] = [
    {
      id: generateId(),
      customerName: "Stark Aeronautics",
      email: "procurement@starkaero.com",
      phone: "+1 (555) 019-2834",
      productName: "Titan Industrial Mesh",
      message: "Require quote for 5,000 sq ft of high-tensile mesh for aerospace staging facility. Need rapid deployment specs.",
      status: "new",
      createdAt: "2024-10-24T09:41:00Z",
      updatedAt: "2024-10-24T09:41:00Z",
    },
    {
      id: generateId(),
      customerName: "OmniCorp Manufacturing",
      email: "d.robocop@omnicorp.net",
      phone: "+1 (555) 882-1004",
      productName: "Custom Extrusion Profiles",
      message: "Looking for pricing on custom heavy-duty polymer extrusions. Attached technical drawings for review.",
      status: "in-progress",
      createdAt: "2024-10-23T14:22:00Z",
      updatedAt: "2024-10-23T14:22:00Z",
    },
    {
      id: generateId(),
      customerName: "Wayne Enterprises",
      email: "l.fox@wayne.com",
      phone: "+1 (555) 392-4411",
      productName: "Kevlar Composite Panels",
      message: "Initial quote accepted. Moving to formal P.O. processing for vehicle armoring division.",
      status: "done",
      createdAt: "2024-10-20T11:05:00Z",
      updatedAt: "2024-10-20T11:05:00Z",
    },
  ];

  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
  localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));
  localStorage.setItem(STORAGE_KEYS.seeded, "true");
  localStorage.setItem(STORAGE_KEYS.seedVersion, SEED_VERSION);
}

function getItems<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  seedData();
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

// --- Products ---

export function getProducts(): AdminProduct[] {
  return getItems<AdminProduct>(STORAGE_KEYS.products);
}

export function getProduct(id: string): AdminProduct | undefined {
  return getProducts().find((p) => p.id === id);
}

export function createProduct(data: Omit<AdminProduct, "id" | "createdAt" | "updatedAt" | "slug">): AdminProduct {
  const products = getProducts();
  const categories = getCategories();
  const cat = categories.find((c) => c.id === data.categoryId);
  const subcategory = cat && cat.parentId ? cat.name : (data.categoryName || "");
  const product = {
    ...data,
    id: generateId(),
    slug: slugify(data.name),
    subcategory,
    badge: null,
    badgeColor: null,
    createdAt: now(),
    updatedAt: now(),
  };
  products.unshift(product);
  setItems(STORAGE_KEYS.products, products);
  return product as AdminProduct;
}

export function updateProduct(id: string, data: Partial<Omit<AdminProduct, "id" | "createdAt">>): AdminProduct | undefined {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx] = { ...products[idx], ...data, slug: data.name ? slugify(data.name) : products[idx].slug, updatedAt: now() };
  setItems(STORAGE_KEYS.products, products);
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  setItems(STORAGE_KEYS.products, filtered);
  return true;
}

// --- Categories ---

export function getCategories(): AdminCategory[] {
  return getItems<AdminCategory>(STORAGE_KEYS.categories);
}

export function getCategory(id: string): AdminCategory | undefined {
  return getCategories().find((c) => c.id === id);
}

export function createCategory(data: Omit<AdminCategory, "id" | "createdAt" | "updatedAt" | "slug">): AdminCategory {
  const categories = getCategories();
  const category: AdminCategory = {
    ...data,
    id: generateId(),
    slug: slugify(data.name),
    createdAt: now(),
    updatedAt: now(),
  };
  categories.push(category);
  setItems(STORAGE_KEYS.categories, categories);
  return category;
}

export function updateCategory(id: string, data: Partial<Omit<AdminCategory, "id" | "createdAt">>): AdminCategory | undefined {
  const categories = getCategories();
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  categories[idx] = { ...categories[idx], ...data, slug: data.name ? slugify(data.name) : categories[idx].slug, updatedAt: now() };
  setItems(STORAGE_KEYS.categories, categories);
  return categories[idx];
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  setItems(STORAGE_KEYS.categories, filtered);
  return true;
}

// --- Quotes ---

export function getQuotes(): QuoteRequest[] {
  return getItems<QuoteRequest>(STORAGE_KEYS.quotes);
}

export function updateQuoteStatus(id: string, status: QuoteRequest["status"]): QuoteRequest | undefined {
  const quotes = getQuotes();
  const idx = quotes.findIndex((q) => q.id === id);
  if (idx === -1) return undefined;
  quotes[idx] = { ...quotes[idx], status, updatedAt: now() };
  setItems(STORAGE_KEYS.quotes, quotes);
  return quotes[idx];
}

export function deleteQuote(id: string): boolean {
  const quotes = getQuotes();
  const filtered = quotes.filter((q) => q.id !== id);
  if (filtered.length === quotes.length) return false;
  setItems(STORAGE_KEYS.quotes, filtered);
  return true;
}

// --- Stats ---

export function getAdminStats() {
  const products = getProducts();
  const categories = getCategories();
  const quotes = getQuotes();
  return {
    totalProducts: products.length,
    totalCategories: categories.length,
    featuredProducts: products.filter((p) => p.featured).length,
    publishedProducts: products.filter((p) => p.status === "published").length,
    draftProducts: products.filter((p) => p.status === "draft").length,
    totalQuotes: quotes.length,
    newQuotes: quotes.filter((q) => q.status === "new").length,
    recentProducts: products.slice(0, 5),
  };
}
