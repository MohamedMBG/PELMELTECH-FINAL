/**
 * Server-side data store for products, categories, and quotes.
 *
 * Production uses Postgres (VPS or any standard server) when DATABASE_URL is
 * configured. Local development can still run without a database by falling
 * back to data/store.json.
 */

import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { hashPassword } from "@/lib/auth";
import { isFileStoreAllowed } from "@/lib/config";
import { ensureSchema, isSchemaComplete, TABLE_NAMES } from "@/lib/schema";
import productsSeed from "@/data/products.json";
import categoriesSeed from "@/data/categories.json";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

type Product = Record<string, unknown> & { id: string };
type Category = Record<string, unknown> & { id: string };
type Quote = Record<string, unknown> & { id: string };
type Devis = Record<string, unknown> & { id: string };

/** Sections a member account can be granted access to. */
export const ALL_PERMISSIONS = ["products", "categories", "quotes", "users"] as const;
export type Permission = (typeof ALL_PERMISSIONS)[number];

export interface User {
  id: string;
  username: string;
  name: string;
  role: "superadmin" | "member";
  permissions: Permission[];
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

/** User without the password hash — safe to send to clients. */
export type PublicUser = Omit<User, "passwordHash">;

interface Store {
  products: Product[];
  categories: Category[];
  quotes: Quote[];
  devis: Devis[];
  users: User[];
}

export interface BackupSnapshot {
  formatVersion: 1;
  exportedAt: string;
  data: Store;
}

type Sql = ReturnType<typeof postgres>;

const databaseUrl = process.env.DATABASE_URL;
// ponytail: default pool (long-running server on the VPS). If deployed to a
// serverless host instead, add { max: 1 } to avoid exhausting DB connections.
// connect_timeout bounds how long a health check / request waits on an
// unreachable DB instead of hanging.
const sql = databaseUrl ? postgres(databaseUrl, { connect_timeout: 10 }) : null;
let initPromise: Promise<void> | null = null;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function now(): string {
  return new Date().toISOString();
}

function seed(): Store {
  return {
    products: JSON.parse(JSON.stringify(productsSeed)),
    categories: JSON.parse(JSON.stringify(categoriesSeed)),
    quotes: [],
    devis: [],
    users: [],
  };
}

/** Guard: the JSON file store is a development-only convenience. */
function assertFileStoreAllowed(): void {
  if (!isFileStoreAllowed()) {
    throw new Error(
      "DATABASE_URL is required in production; refusing to use the data/store.json fallback",
    );
  }
}

function readFileStore(): Store {
  assertFileStoreAllowed();
  try {
    const store = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Store;
    store.users ??= []; // older stores predate the users table
    store.devis ??= []; // older stores predate the devis table
    return store;
  } catch {
    const store = seed();
    writeFileStore(store);
    return store;
  }
}

function writeFileStore(store: Store): void {
  assertFileStoreAllowed();
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function rowData<T>(row: Record<string, unknown> | undefined): T | undefined {
  if (!row) return undefined;
  return typeof row.data === "string" ? JSON.parse(row.data) : (row.data as T);
}

async function getDb(): Promise<Sql | null> {
  if (!sql) {
    if (!isFileStoreAllowed()) {
      throw new Error("DATABASE_URL is required in production but is not set");
    }
    return null;
  }
  initPromise ??= initDb(sql);
  await initPromise;
  return sql;
}

/**
 * Lightweight readiness probe for the health endpoint. Never throws and never
 * exposes the connection string. Distinguishes "no DB configured" from
 * "configured but unreachable" and reports whether the schema exists.
 */
export async function pingDb(): Promise<{ configured: boolean; reachable: boolean; schemaReady: boolean }> {
  if (!sql) return { configured: false, reachable: false, schemaReady: false };
  try {
    await sql`SELECT 1`;
    // schemaReady is true only when ALL five tables exist.
    const rows = await sql<{ name: string }[]>`
      SELECT t AS name
      FROM unnest(${sql.array([...TABLE_NAMES])}::text[]) AS t
      WHERE to_regclass('public.' || t) IS NOT NULL
    `;
    return {
      configured: true,
      reachable: true,
      schemaReady: isSchemaComplete(rows.map((r) => r.name)),
    };
  } catch {
    return { configured: true, reachable: false, schemaReady: false };
  }
}

async function initDb(db: Sql): Promise<void> {
  // Shared schema source (also used by `npm run db:init`).
  await ensureSchema(db);

  const [productCount] = await db`SELECT COUNT(*)::int AS count FROM pelmel_products`;
  if (Number(productCount?.count ?? 0) === 0) {
    for (const product of seed().products) {
      await db`
        INSERT INTO pelmel_products (id, data)
        VALUES (${product.id}, ${JSON.stringify(product)}::jsonb)
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  const [categoryCount] = await db`SELECT COUNT(*)::int AS count FROM pelmel_categories`;
  if (Number(categoryCount?.count ?? 0) === 0) {
    for (const category of seed().categories) {
      await db`
        INSERT INTO pelmel_categories (id, data)
        VALUES (${category.id}, ${JSON.stringify(category)}::jsonb)
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }
}

/**
 * Returns a consistent logical export of every application-owned table.
 * Passwords remain PBKDF2 hashes, never plaintext. The caller must encrypt
 * this snapshot before it leaves the server.
 */
export async function createBackupSnapshot(): Promise<BackupSnapshot> {
  const db = await getDb();
  if (!db) {
    return {
      formatVersion: 1,
      exportedAt: now(),
      data: readFileStore(),
    };
  }

  const [products, categories, quotes, devis, users] = await db.begin(async (tx) => {
    await tx`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY`;
    return Promise.all([
      tx`SELECT data FROM pelmel_products ORDER BY id`,
      tx`SELECT data FROM pelmel_categories ORDER BY id`,
      tx`SELECT data FROM pelmel_quotes ORDER BY id`,
      tx`SELECT data FROM pelmel_devis ORDER BY id`,
      tx`SELECT data FROM pelmel_users ORDER BY id`,
    ]);
  });

  const unpack = <T>(rows: Record<string, unknown>[]): T[] =>
    rows.map((row) => rowData<T>(row)).filter((item): item is T => item !== undefined);

  return {
    formatVersion: 1,
    exportedAt: now(),
    data: {
      products: unpack<Product>(products),
      categories: unpack<Category>(categories),
      quotes: unpack<Quote>(quotes),
      devis: unpack<Devis>(devis),
      users: unpack<User>(users),
    },
  };
}

// --- Products ---

export async function getProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return readFileStore().products;

  const rows = await db`
    SELECT data
    FROM pelmel_products
    ORDER BY COALESCE(data->>'createdAt', '') DESC
  `;
  return rows.map((row) => rowData<Product>(row)).filter(Boolean) as Product[];
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return readFileStore().products.find((p) => p.id === id);

  const [row] = await db`SELECT data FROM pelmel_products WHERE id = ${id} LIMIT 1`;
  return rowData<Product>(row);
}

export async function createProduct(data: Record<string, unknown>): Promise<Product> {
  const db = await getDb();

  const categories = db ? await getCategories() : readFileStore().categories;
  const cat = categories.find((c) => c.id === data.categoryId);
  const subcategory = cat && cat.parentId ? cat.name : data.categoryName || "";
  const product: Product = {
    ...data,
    id: generateId(),
    slug: slugify(String(data.name || "")),
    subcategory,
    badge: (data.badge as string) ?? null,
    badgeColor: (data.badgeColor as string) ?? null,
    createdAt: now(),
    updatedAt: now(),
  } as Product;

  if (!db) {
    const store = readFileStore();
    store.products.unshift(product);
    writeFileStore(store);
    return product;
  }

  await db`
    INSERT INTO pelmel_products (id, data)
    VALUES (${product.id}, ${JSON.stringify(product)}::jsonb)
  `;
  return product;
}

export async function updateProduct(id: string, data: Record<string, unknown>): Promise<Product | undefined> {
  const db = await getDb();

  if (!db) {
    const store = readFileStore();
    const idx = store.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    store.products[idx] = {
      ...store.products[idx],
      ...data,
      slug: data.name ? slugify(String(data.name)) : store.products[idx].slug,
      updatedAt: now(),
    };
    writeFileStore(store);
    return store.products[idx];
  }

  const existing = await getProduct(id);
  if (!existing) return undefined;
  const updated: Product = {
    ...existing,
    ...data,
    slug: data.name ? slugify(String(data.name)) : existing.slug,
    updatedAt: now(),
  };
  await db`
    UPDATE pelmel_products
    SET data = ${JSON.stringify(updated)}::jsonb, updated_at = now()
    WHERE id = ${id}
  `;
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    const store = readFileStore();
    const next = store.products.filter((p) => p.id !== id);
    if (next.length === store.products.length) return false;
    store.products = next;
    writeFileStore(store);
    return true;
  }

  const rows = await db`DELETE FROM pelmel_products WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

// --- Categories ---

export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  if (!db) return readFileStore().categories;

  const rows = await db`
    SELECT data
    FROM pelmel_categories
    ORDER BY COALESCE((data->>'sortOrder')::int, 0), COALESCE(data->>'name', '')
  `;
  return rows.map((row) => rowData<Category>(row)).filter(Boolean) as Category[];
}

export async function createCategory(data: Record<string, unknown>): Promise<Category> {
  const db = await getDb();
  const category: Category = {
    ...data,
    id: generateId(),
    slug: slugify(String(data.name || "")),
    icon: (data.icon as string) ?? null,
    createdAt: now(),
    updatedAt: now(),
  } as Category;

  if (!db) {
    const store = readFileStore();
    store.categories.push(category);
    writeFileStore(store);
    return category;
  }

  await db`
    INSERT INTO pelmel_categories (id, data)
    VALUES (${category.id}, ${JSON.stringify(category)}::jsonb)
  `;
  return category;
}

export async function updateCategory(id: string, data: Record<string, unknown>): Promise<Category | undefined> {
  const db = await getDb();

  if (!db) {
    const store = readFileStore();
    const idx = store.categories.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    store.categories[idx] = {
      ...store.categories[idx],
      ...data,
      slug: data.name ? slugify(String(data.name)) : store.categories[idx].slug,
      updatedAt: now(),
    };
    writeFileStore(store);
    return store.categories[idx];
  }

  const [row] = await db`SELECT data FROM pelmel_categories WHERE id = ${id} LIMIT 1`;
  const existing = rowData<Category>(row);
  if (!existing) return undefined;
  const updated: Category = {
    ...existing,
    ...data,
    slug: data.name ? slugify(String(data.name)) : existing.slug,
    updatedAt: now(),
  };
  await db`
    UPDATE pelmel_categories
    SET data = ${JSON.stringify(updated)}::jsonb, updated_at = now()
    WHERE id = ${id}
  `;
  return updated;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    const store = readFileStore();
    const next = store.categories.filter((c) => c.id !== id);
    if (next.length === store.categories.length) return false;
    store.categories = next;
    writeFileStore(store);
    return true;
  }

  const rows = await db`DELETE FROM pelmel_categories WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

// --- Quotes ---

export async function getQuotes(): Promise<Quote[]> {
  const db = await getDb();
  if (!db) return readFileStore().quotes;

  const rows = await db`
    SELECT data
    FROM pelmel_quotes
    ORDER BY COALESCE(data->>'createdAt', '') DESC
  `;
  return rows.map((row) => rowData<Quote>(row)).filter(Boolean) as Quote[];
}

export async function createQuote(data: Record<string, unknown>): Promise<Quote> {
  const db = await getDb();
  const quote: Quote = {
    ...data,
    id: generateId(),
    status: "new",
    createdAt: now(),
    updatedAt: now(),
  } as Quote;

  if (!db) {
    const store = readFileStore();
    store.quotes.unshift(quote);
    writeFileStore(store);
    return quote;
  }

  await db`
    INSERT INTO pelmel_quotes (id, data)
    VALUES (${quote.id}, ${JSON.stringify(quote)}::jsonb)
  `;
  return quote;
}

export async function updateQuoteStatus(id: string, status: string): Promise<Quote | undefined> {
  const db = await getDb();

  if (!db) {
    const store = readFileStore();
    const idx = store.quotes.findIndex((q) => q.id === id);
    if (idx === -1) return undefined;
    store.quotes[idx] = { ...store.quotes[idx], status, updatedAt: now() };
    writeFileStore(store);
    return store.quotes[idx];
  }

  const [row] = await db`SELECT data FROM pelmel_quotes WHERE id = ${id} LIMIT 1`;
  const existing = rowData<Quote>(row);
  if (!existing) return undefined;
  const updated: Quote = { ...existing, status, updatedAt: now() };
  await db`
    UPDATE pelmel_quotes
    SET data = ${JSON.stringify(updated)}::jsonb, updated_at = now()
    WHERE id = ${id}
  `;
  return updated;
}

export async function deleteQuote(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    const store = readFileStore();
    const next = store.quotes.filter((q) => q.id !== id);
    if (next.length === store.quotes.length) return false;
    store.quotes = next;
    writeFileStore(store);
    return true;
  }

  const rows = await db`DELETE FROM pelmel_quotes WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

// --- Devis (admin-created quotations / sales) ---

export async function getDevisList(): Promise<Devis[]> {
  const db = await getDb();
  if (!db) return readFileStore().devis;

  const rows = await db`
    SELECT data
    FROM pelmel_devis
    ORDER BY COALESCE(data->>'createdAt', '') DESC
  `;
  return rows.map((row) => rowData<Devis>(row)).filter(Boolean) as Devis[];
}

export async function getDevis(id: string): Promise<Devis | undefined> {
  const db = await getDb();
  if (!db) return readFileStore().devis.find((d) => d.id === id);
  const [row] = await db`SELECT data FROM pelmel_devis WHERE id = ${id} LIMIT 1`;
  return rowData<Devis>(row);
}

export async function createDevis(data: Record<string, unknown>): Promise<Devis> {
  const db = await getDb();
  const id = generateId();
  const devis: Devis = {
    ...data,
    id,
    number: `DEV-${new Date().getFullYear()}-${id.slice(-5).toUpperCase()}`,
    status: "draft",
    createdAt: now(),
    updatedAt: now(),
  } as Devis;

  if (!db) {
    const store = readFileStore();
    store.devis.unshift(devis);
    writeFileStore(store);
    return devis;
  }

  await db`
    INSERT INTO pelmel_devis (id, data)
    VALUES (${devis.id}, ${JSON.stringify(devis)}::jsonb)
  `;
  return devis;
}

export async function updateDevis(id: string, data: Record<string, unknown>): Promise<Devis | undefined> {
  const db = await getDb();

  if (!db) {
    const store = readFileStore();
    const idx = store.devis.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    // id/number/createdAt and the createdBy trace are immutable once issued.
    const { id: _i, number: _n, createdAt: _c, createdById: _ci, createdByName: _cn, ...patch } = data;
    store.devis[idx] = { ...store.devis[idx], ...patch, updatedAt: now() };
    writeFileStore(store);
    return store.devis[idx];
  }

  const existing = await getDevis(id);
  if (!existing) return undefined;
  const { id: _i, number: _n, createdAt: _c, ...patch } = data;
  const updated: Devis = { ...existing, ...patch, updatedAt: now() };
  await db`
    UPDATE pelmel_devis
    SET data = ${JSON.stringify(updated)}::jsonb, updated_at = now()
    WHERE id = ${id}
  `;
  return updated;
}

export async function deleteDevis(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    const store = readFileStore();
    const next = store.devis.filter((d) => d.id !== id);
    if (next.length === store.devis.length) return false;
    store.devis = next;
    writeFileStore(store);
    return true;
  }

  const rows = await db`DELETE FROM pelmel_devis WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

// --- Users ---

function stripHash(user: User): PublicUser {
  const { passwordHash: _hash, ...rest } = user;
  return rest;
}

export async function getUsers(): Promise<PublicUser[]> {
  const db = await getDb();
  const users = db
    ? (await db`SELECT data FROM pelmel_users ORDER BY COALESCE(data->>'createdAt', '')`)
        .map((row) => rowData<User>(row))
        .filter(Boolean as unknown as (u: User | undefined) => u is User)
    : readFileStore().users;
  return users.map(stripHash);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return readFileStore().users.find((u) => u.id === id);
  const [row] = await db`SELECT data FROM pelmel_users WHERE id = ${id} LIMIT 1`;
  return rowData<User>(row);
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const key = username.trim().toLowerCase();
  const db = await getDb();
  if (!db) return readFileStore().users.find((u) => u.username.toLowerCase() === key);
  const [row] = await db`SELECT data FROM pelmel_users WHERE lower(data->>'username') = ${key} LIMIT 1`;
  return rowData<User>(row);
}

interface UserInput {
  username: string;
  name: string;
  password: string;
  role?: User["role"];
  permissions?: Permission[];
}

export async function createUser(input: UserInput): Promise<PublicUser> {
  const role = input.role === "superadmin" ? "superadmin" : "member";
  const user: User = {
    id: generateId(),
    username: input.username.trim(),
    name: input.name.trim() || input.username.trim(),
    role,
    permissions: role === "superadmin" ? [...ALL_PERMISSIONS] : sanitizePermissions(input.permissions),
    passwordHash: await hashPassword(input.password),
    createdAt: now(),
    updatedAt: now(),
  };

  const db = await getDb();
  if (!db) {
    const store = readFileStore();
    store.users.push(user);
    writeFileStore(store);
    return stripHash(user);
  }
  await db`INSERT INTO pelmel_users (id, data) VALUES (${user.id}, ${JSON.stringify(user)}::jsonb)`;
  return stripHash(user);
}

interface UserUpdate {
  name?: string;
  password?: string;
  role?: User["role"];
  permissions?: Permission[];
}

export async function updateUser(id: string, patch: UserUpdate): Promise<PublicUser | undefined> {
  const existing = await getUserById(id);
  if (!existing) return undefined;

  const role = patch.role ?? existing.role;
  const updated: User = {
    ...existing,
    name: patch.name?.trim() || existing.name,
    role,
    permissions:
      role === "superadmin"
        ? [...ALL_PERMISSIONS]
        : patch.permissions
          ? sanitizePermissions(patch.permissions)
          : existing.permissions,
    passwordHash: patch.password ? await hashPassword(patch.password) : existing.passwordHash,
    updatedAt: now(),
  };

  const db = await getDb();
  if (!db) {
    const store = readFileStore();
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    store.users[idx] = updated;
    writeFileStore(store);
    return stripHash(updated);
  }
  await db`UPDATE pelmel_users SET data = ${JSON.stringify(updated)}::jsonb, updated_at = now() WHERE id = ${id}`;
  return stripHash(updated);
}

export async function deleteUser(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    const store = readFileStore();
    const next = store.users.filter((u) => u.id !== id);
    if (next.length === store.users.length) return false;
    store.users = next;
    writeFileStore(store);
    return true;
  }
  const rows = await db`DELETE FROM pelmel_users WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

function sanitizePermissions(perms: Permission[] | undefined): Permission[] {
  if (!Array.isArray(perms)) return [];
  return ALL_PERMISSIONS.filter((p) => perms.includes(p));
}

// --- Stats / analytics (dashboard KPIs) ---

export async function getStats() {
  const [products, categories, quotes] = await Promise.all([
    getProducts(),
    getCategories(),
    getQuotes(),
  ]);
  const p = products;
  const q = quotes;

  const byCount = <T>(arr: T[], key: (t: T) => string) => {
    const m = new Map<string, number>();
    for (const item of arr) m.set(key(item), (m.get(key(item)) || 0) + 1);
    return Array.from(m, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  };

  const priced = p.filter((x) => !x.quoteOnly && typeof x.price === "number");
  const buckets = [
    { label: "< $100", test: (v: number) => v < 100 },
    { label: "$100-500", test: (v: number) => v >= 100 && v < 500 },
    { label: "$500-2k", test: (v: number) => v >= 500 && v < 2000 },
    { label: "$2k+", test: (v: number) => v >= 2000 },
  ];
  const priceBuckets = buckets.map((b) => ({
    name: b.label,
    count: priced.filter((x) => b.test(x.price as number)).length,
  }));

  const days: { name: string; count: number }[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      name: iso.slice(5),
      count: q.filter((x) => String(x.createdAt).slice(0, 10) === iso).length,
    });
  }

  const staleMs = 30 * 24 * 60 * 60 * 1000;
  const missingImage = p.filter((x) => !x.imageUrl).map((x) => x.name);
  const noPrice = p.filter((x) => !x.quoteOnly && (x.price === null || x.price === undefined)).map((x) => x.name);
  const staleDrafts = p
    .filter((x) => x.status === "draft" && Date.now() - new Date(String(x.updatedAt)).getTime() > staleMs)
    .map((x) => x.name);
  const usedCatIds = new Set(p.map((x) => x.categoryId));
  const emptyCategories = categories
    .filter((c) => c.parentId && !usedCatIds.has(c.id))
    .map((c) => c.name);

  const done = q.filter((x) => x.status === "done").length;

  const prices = priced.map((x) => x.price as number);
  const catalogValue = prices.reduce((s, v) => s + v, 0);
  const avgPrice = prices.length ? catalogValue / prices.length : 0;
  const openQuotes = q.filter((x) => x.status !== "done").length;

  // Quote requests this week vs the previous week (momentum indicator).
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const nowMs = Date.now();
  const inWindow = (x: Quote, from: number, to: number) => {
    const t = new Date(String(x.createdAt)).getTime();
    return t >= from && t < to;
  };
  const quotesThisWeek = q.filter((x) => inWindow(x, nowMs - weekMs, nowMs)).length;
  const quotesPrevWeek = q.filter((x) => inWindow(x, nowMs - 2 * weekMs, nowMs - weekMs)).length;
  const weekTrend = quotesPrevWeek === 0
    ? (quotesThisWeek > 0 ? 100 : 0)
    : Math.round(((quotesThisWeek - quotesPrevWeek) / quotesPrevWeek) * 100);

  return {
    totalProducts: p.length,
    publishedProducts: p.filter((x) => x.status === "published").length,
    draftProducts: p.filter((x) => x.status === "draft").length,
    featuredProducts: p.filter((x) => x.featured).length,
    totalCategories: categories.length,
    catalogValue,
    avgPrice,
    quoteOnlyProducts: p.filter((x) => x.quoteOnly).length,
    openQuotes,
    quotesThisWeek,
    weekTrend,
    productsByCategory: byCount(p, (x) => String(x.categoryName || "Uncategorized")).slice(0, 8),
    productsByType: byCount(p, (x) => String(x.type || "other")),
    priceBuckets,
    quotes: {
      total: q.length,
      new: q.filter((x) => x.status === "new").length,
      inProgress: q.filter((x) => x.status === "in-progress").length,
      done,
      conversionRate: q.length ? Math.round((done / q.length) * 100) : 0,
    },
    quotesByDay: days,
    alerts: {
      missingImage,
      noPrice,
      staleDrafts,
      emptyCategories,
    },
    recentProducts: p.slice(0, 5),
    recentQuotes: q.slice(0, 5),
  };
}
