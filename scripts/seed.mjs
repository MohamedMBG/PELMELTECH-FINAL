/**
 * Seed / refresh the Neon database from src/data/*.json.
 * Idempotent: upserts by id, so re-running updates existing rows.
 *
 * Run:  node --env-file=.env.local scripts/seed.mjs
 *   (or set DATABASE_URL in the environment first)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Pass --env-file=.env.local or export it.");
  process.exit(1);
}

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
const products = readJson("src/data/products.json");
const categories = readJson("src/data/categories.json");

const sql = neon(url);

await sql`CREATE TABLE IF NOT EXISTS pelmel_products (id text PRIMARY KEY, data jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`;
await sql`CREATE TABLE IF NOT EXISTS pelmel_categories (id text PRIMARY KEY, data jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`;
await sql`CREATE TABLE IF NOT EXISTS pelmel_quotes (id text PRIMARY KEY, data jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`;

for (const c of categories) {
  await sql`INSERT INTO pelmel_categories (id, data) VALUES (${c.id}, ${JSON.stringify(c)}::jsonb)
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
}
for (const p of products) {
  await sql`INSERT INTO pelmel_products (id, data) VALUES (${p.id}, ${JSON.stringify(p)}::jsonb)
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
}

// Prune rows no longer present in the source JSON (e.g. old categories whose
// ids were replaced). Keeps the DB an exact mirror of src/data/*.json.
const catIds = categories.map((c) => c.id);
const prodIds = products.map((p) => p.id);
await sql`DELETE FROM pelmel_categories WHERE id <> ALL(${catIds})`;
await sql`DELETE FROM pelmel_products WHERE id <> ALL(${prodIds})`;

const [{ count: pc }] = await sql`SELECT COUNT(*)::int AS count FROM pelmel_products`;
const [{ count: cc }] = await sql`SELECT COUNT(*)::int AS count FROM pelmel_categories`;
console.log(`Seeded. products=${pc} categories=${cc}`);
