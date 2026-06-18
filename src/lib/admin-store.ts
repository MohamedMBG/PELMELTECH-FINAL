/**
 * Demo localStorage-based store for admin panel.
 * TODO: Replace with real API calls when backend is available.
 */

import { AdminProduct, AdminCategory, QuoteRequest } from "./admin-types";
import { PRODUCTS } from "./constants";

const STORAGE_KEYS = {
  products: "pelmeltech_admin_products",
  categories: "pelmeltech_admin_categories",
  quotes: "pelmeltech_admin_quotes",
  seeded: "pelmeltech_admin_seeded",
} as const;

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

// --- Category seed ---

const SEED_CATEGORIES: Omit<AdminCategory, "id" | "createdAt" | "updatedAt">[] = [
  { name: "Standard Printers", slug: "standard-printers", description: "Business color printers for offices", imageUrl: "", parentId: null, sortOrder: 0, status: "published" },
  { name: "Large Format Printers", slug: "large-format-printers", description: "Wide-format production printers", imageUrl: "", parentId: null, sortOrder: 1, status: "published" },
  { name: "Event Printers", slug: "event-printers", description: "Portable event print systems", imageUrl: "", parentId: null, sortOrder: 2, status: "published" },
  { name: "Industrial Printers", slug: "industrial-printers", description: "High-volume production platforms", imageUrl: "", parentId: null, sortOrder: 3, status: "published" },
  { name: "Plotters", slug: "plotters", description: "Technical plotting and cutting systems", imageUrl: "", parentId: null, sortOrder: 4, status: "published" },
  { name: "Banners & Mesh", slug: "banners-and-mesh", description: "Outdoor banner and mesh substrates", imageUrl: "", parentId: null, sortOrder: 5, status: "published" },
  { name: "Rigid Panels", slug: "rigid-panels", description: "Rigid display and signage panels", imageUrl: "", parentId: null, sortOrder: 6, status: "published" },
  { name: "Soft Signage", slug: "soft-signage", description: "Printed fabric display materials", imageUrl: "", parentId: null, sortOrder: 7, status: "published" },
  { name: "Vinyl & Wraps", slug: "vinyl-and-wraps", description: "Adhesive vinyl and wrap media", imageUrl: "", parentId: null, sortOrder: 8, status: "published" },
  { name: "Exhibition", slug: "exhibition", description: "Portable exhibition display systems", imageUrl: "", parentId: null, sortOrder: 9, status: "published" },
  { name: "Ink & Toner", slug: "ink-and-toner", description: "Printer consumable supplies", imageUrl: "", parentId: null, sortOrder: 10, status: "published" },
  { name: "Paper & Rolls", slug: "paper-and-rolls", description: "Printable roll media", imageUrl: "", parentId: null, sortOrder: 11, status: "published" },
  { name: "Printer Parts", slug: "printer-parts", description: "Replacement printer parts", imageUrl: "", parentId: null, sortOrder: 12, status: "published" },
  { name: "Maintenance Tools", slug: "maintenance-tools", description: "Printer maintenance accessories", imageUrl: "", parentId: null, sortOrder: 13, status: "published" },
];

function categoryToType(category: string): AdminProduct["type"] {
  const machines = ["Standard Printers", "Large Format Printers", "Event Printers", "Industrial Printers", "Plotters"];
  const materials = ["Banners & Mesh", "Rigid Panels", "Soft Signage", "Vinyl & Wraps", "Paper & Rolls"];
  const consumables = ["Ink & Toner"];
  const accessories = ["Printer Parts", "Maintenance Tools"];
  if (machines.includes(category)) return "machine";
  if (materials.includes(category)) return "material";
  if (consumables.includes(category)) return "consumable";
  if (accessories.includes(category)) return "accessory";
  return "service";
}

function parsePrice(price: string): number | null {
  const match = price.match(/\$?([\d.]+)/);
  return match ? parseFloat(match[1]) : null;
}

function seedData(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(STORAGE_KEYS.seeded)) return;

  const ts = now();

  const categories: AdminCategory[] = SEED_CATEGORIES.map((c) => ({
    ...c,
    id: generateId(),
    createdAt: ts,
    updatedAt: ts,
  }));

  const categoryMap = new Map(categories.map((c) => [c.name, c]));

  const products: AdminProduct[] = PRODUCTS.map((p) => {
    const cat = categoryMap.get(p.category);
    const priceVal = parsePrice(p.price);
    return {
      id: generateId(),
      name: p.name,
      slug: slugify(p.name),
      categoryId: cat?.id ?? "",
      categoryName: p.category,
      shortDescription: p.description,
      description: p.description,
      imageUrl: p.image,
      gallery: [],
      price: priceVal,
      quoteOnly: priceVal === null,
      featured: p.badge === "Bestseller" || p.badge === "Popular" || p.badge === "Premium",
      status: "published" as const,
      type: categoryToType(p.category),
      specifications: {},
      ctaLabel: priceVal === null ? "Request Quote" as const : "View Details" as const,
      createdAt: ts,
      updatedAt: ts,
    };
  });

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
  const product: AdminProduct = {
    ...data,
    id: generateId(),
    slug: slugify(data.name),
    createdAt: now(),
    updatedAt: now(),
  };
  products.unshift(product);
  setItems(STORAGE_KEYS.products, products);
  return product;
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
