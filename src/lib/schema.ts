/**
 * Single source of truth for the database schema.
 *
 * Both the running application (src/lib/server-store.ts, on first DB access)
 * and the explicit `npm run db:init` script call `ensureSchema`, so the table
 * definitions live in exactly one place. `ensureSchema` only creates tables if
 * they are missing — it never drops or alters existing tables and never
 * touches row data.
 */

import type postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

/** Every application-owned table, in dependency-free creation order. */
export const TABLE_NAMES = [
  "pelmel_products",
  "pelmel_categories",
  "pelmel_quotes",
  "pelmel_devis",
  "pelmel_users",
] as const;

/** True only when every required table is present. */
export function isSchemaComplete(presentTables: Iterable<string>): boolean {
  const present = new Set(presentTables);
  return TABLE_NAMES.every((name) => present.has(name));
}

/** Create all required tables if they do not already exist. Idempotent. */
export async function ensureSchema(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS pelmel_products (
      id text PRIMARY KEY,
      data jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS pelmel_categories (
      id text PRIMARY KEY,
      data jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS pelmel_quotes (
      id text PRIMARY KEY,
      data jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS pelmel_devis (
      id text PRIMARY KEY,
      data jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS pelmel_users (
      id text PRIMARY KEY,
      data jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}
