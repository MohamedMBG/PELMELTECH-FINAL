/**
 * Seed initial products and categories from src/data/*.json.
 *
 *   npm run seed:initial            # safe: upsert only, never deletes
 *   npm run seed:sync:destructive   # DANGEROUS: also prunes rows absent from JSON
 *
 * Safe mode (default) inserts new seed rows and updates existing seed rows by
 * id. It never deletes, so products/categories created in the admin panel are
 * preserved. Running it twice does not duplicate rows (upsert by primary key).
 *
 * Destructive prune (rows in the DB but not in the JSON get DELETED) requires
 * ALL of: the --prune flag, CONFIRM_DESTRUCTIVE_SEED=yes, and NODE_ENV!=production.
 * It prints the ids it will delete before deleting them.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { ensureSchema } from "../src/lib/schema";
import { resolvePrune } from "../src/lib/seed-logic";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Export it or pass --env-file=.env.local.");
  process.exit(1);
}

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const readJson = (rel: string) =>
  JSON.parse(fs.readFileSync(path.join(root, rel), "utf8")) as { id: string }[];
const products = readJson("src/data/products.json");
const categories = readJson("src/data/categories.json");

const prune = resolvePrune(process.argv.slice(2), process.env);
console.log(`Mode: upsert${prune.allowed ? " + PRUNE" : " only"} — ${prune.reason}`);

const sql = postgres(url, { connect_timeout: 10 });

try {
  await ensureSchema(sql);

  for (const c of categories) {
    await sql`INSERT INTO pelmel_categories (id, data) VALUES (${c.id}, ${JSON.stringify(c)}::jsonb)
              ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
  }
  for (const p of products) {
    await sql`INSERT INTO pelmel_products (id, data) VALUES (${p.id}, ${JSON.stringify(p)}::jsonb)
              ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
  }

  if (prune.allowed) {
    const catIds = categories.map((c) => c.id);
    const prodIds = products.map((p) => p.id);
    const staleCats = await sql`SELECT id FROM pelmel_categories WHERE id <> ALL(${sql.array(catIds)})`;
    const staleProds = await sql`SELECT id FROM pelmel_products WHERE id <> ALL(${sql.array(prodIds)})`;
    console.warn(
      `PRUNE will delete ${staleCats.length} categor(y/ies) and ${staleProds.length} product(s) ` +
        `not present in src/data/*.json:`,
    );
    for (const r of staleCats) console.warn(`  category ${r.id}`);
    for (const r of staleProds) console.warn(`  product  ${r.id}`);
    await sql`DELETE FROM pelmel_categories WHERE id <> ALL(${sql.array(catIds)})`;
    await sql`DELETE FROM pelmel_products WHERE id <> ALL(${sql.array(prodIds)})`;
  }

  const [{ count: pc }] = await sql`SELECT COUNT(*)::int AS count FROM pelmel_products`;
  const [{ count: cc }] = await sql`SELECT COUNT(*)::int AS count FROM pelmel_categories`;
  console.log(`Seeded. products=${pc} categories=${cc}`);
} catch (error) {
  console.error("Seed failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
