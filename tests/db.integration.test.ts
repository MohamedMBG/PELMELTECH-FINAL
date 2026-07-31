/**
 * Integration tests that need a REAL, DISPOSABLE Postgres. They are skipped
 * unless TEST_DATABASE_URL is set. Never point this at production or any remote
 * database — use a throwaway local database only, e.g.:
 *
 *   createdb pelmel_test
 *   TEST_DATABASE_URL=postgresql://localhost:5432/pelmel_test npm test
 *
 * Covered here: schema init is idempotent; a safe (upsert-only) seed pass does
 * not delete admin-created rows.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import postgres from "postgres";
import { ensureSchema, TABLE_NAMES } from "../src/lib/schema";

const url = process.env.TEST_DATABASE_URL;
const runIntegration = Boolean(url);

test(
  "schema init is idempotent and all five tables exist",
  { skip: runIntegration ? false : "set TEST_DATABASE_URL to run (disposable DB only)" },
  async () => {
    const sql = postgres(url!, { connect_timeout: 10 });
    try {
      await ensureSchema(sql);
      await ensureSchema(sql); // second run must not fail
      for (const name of TABLE_NAMES) {
        const [row] = await sql`SELECT to_regclass(${"public." + name}) AS present`;
        assert.ok(row?.present, `table ${name} should exist`);
      }
    } finally {
      await sql.end();
    }
  },
);

test(
  "an upsert-only seed pass preserves admin-created rows",
  { skip: runIntegration ? false : "set TEST_DATABASE_URL to run (disposable DB only)" },
  async () => {
    const sql = postgres(url!, { connect_timeout: 10 });
    const adminId = "test-admin-created-row";
    try {
      await ensureSchema(sql);
      await sql`INSERT INTO pelmel_products (id, data) VALUES (${adminId}, ${JSON.stringify({ id: adminId, name: "Admin Product" })}::jsonb)
                ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`;
      // Simulate the safe seed: upsert a seed row, DELETE nothing.
      await sql`INSERT INTO pelmel_products (id, data) VALUES (${"seed-row"}, ${JSON.stringify({ id: "seed-row", name: "Seed" })}::jsonb)
                ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`;
      const [row] = await sql`SELECT id FROM pelmel_products WHERE id = ${adminId}`;
      assert.equal(row?.id, adminId, "admin-created row must survive a safe seed");
    } finally {
      await sql`DELETE FROM pelmel_products WHERE id IN (${adminId}, ${"seed-row"})`;
      await sql.end();
    }
  },
);
