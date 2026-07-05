/**
 * Admin client. Thin async wrapper over the REST API (/api/*), which is
 * backed by the server-side JSON store. Every write persists server-side and
 * is instantly visible on the public site for all visitors.
 */

import { AdminProduct, AdminCategory, QuoteRequest } from "./admin-types";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${init?.method || "GET"} ${url} → ${res.status}`);
  return res.json();
}

// --- Products ---

export function getProducts(): Promise<AdminProduct[]> {
  return api("/api/products");
}

export function getProduct(id: string): Promise<AdminProduct> {
  return api(`/api/products/${id}`);
}

export function createProduct(data: Omit<AdminProduct, "id" | "createdAt" | "updatedAt" | "slug">): Promise<AdminProduct> {
  return api("/api/products", { method: "POST", body: JSON.stringify(data) });
}

export function updateProduct(id: string, data: Partial<AdminProduct>): Promise<AdminProduct> {
  return api(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteProduct(id: string): Promise<{ ok: boolean }> {
  return api(`/api/products/${id}`, { method: "DELETE" });
}

// --- Categories ---

export function getCategories(): Promise<AdminCategory[]> {
  return api("/api/categories");
}

export function createCategory(data: Omit<AdminCategory, "id" | "createdAt" | "updatedAt" | "slug">): Promise<AdminCategory> {
  return api("/api/categories", { method: "POST", body: JSON.stringify(data) });
}

export function updateCategory(id: string, data: Partial<AdminCategory>): Promise<AdminCategory> {
  return api(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteCategory(id: string): Promise<{ ok: boolean }> {
  return api(`/api/categories/${id}`, { method: "DELETE" });
}

// --- Quotes ---

export function getQuotes(): Promise<QuoteRequest[]> {
  return api("/api/quotes");
}

export function updateQuoteStatus(id: string, status: QuoteRequest["status"]): Promise<QuoteRequest> {
  return api(`/api/quotes/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export function deleteQuote(id: string): Promise<{ ok: boolean }> {
  return api(`/api/quotes/${id}`, { method: "DELETE" });
}

// --- Stats ---

export function getAdminStats(): Promise<AdminStats> {
  return api<AdminStats>("/api/stats");
}

export interface AdminStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  featuredProducts: number;
  totalCategories: number;
  productsByCategory: { name: string; count: number }[];
  productsByType: { name: string; count: number }[];
  priceBuckets: { name: string; count: number }[];
  quotes: { total: number; new: number; inProgress: number; done: number; conversionRate: number };
  quotesByDay: { name: string; count: number }[];
  alerts: { missingImage: string[]; noPrice: string[]; staleDrafts: string[]; emptyCategories: string[] };
  recentProducts: AdminProduct[];
  recentQuotes: QuoteRequest[];
}
