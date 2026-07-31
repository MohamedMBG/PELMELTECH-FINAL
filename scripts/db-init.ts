/**
 * Explicitly create the database schema. Deployment should run this once so it
 * does not depend on the first HTTP request creating tables.
 *
 * Run:
 *   npm run db:init
 *   node --import tsx --env-file=.env.local scripts/db-init.ts   # optional file
 *
 * Reads DATABASE_URL from the environment. Creates all five tables if missing.
 * Idempotent, never deletes data, never seeds products. Closes the connection.
 *
 * The executable body lives in main() so the file compiles under CommonJS
 * (the project has no "type":"module"); top-level await would otherwise fail
 * the tsx/esbuild transform.
 */

import postgres from "postgres";
import { ensureSchema, TABLE_NAMES } from "../src/lib/schema";

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Export it or pass --env-file=.env.local.");
    process.exit(1);
  }

  const sql = postgres(url, { connect_timeout: 10 });

  try {
    await ensureSchema(sql);
    // Report which tables now exist (present vs. unexpectedly missing).
    const rows = await sql<{ name: string; present: string | null }[]>`
      SELECT t.name, to_regclass('public.' || t.name) AS present
      FROM unnest(${sql.array([...TABLE_NAMES])}::text[]) AS t(name)
    `;
    const missing = rows.filter((r) => !r.present).map((r) => r.name);
    if (missing.length > 0) {
      console.error(`Schema init incomplete; missing tables: ${missing.join(", ")}`);
      process.exitCode = 1;
      return;
    }
    console.log(`Schema ready. Tables: ${rows.map((r) => r.name).join(", ")}`);
  } finally {
    await sql.end();
  }
}

main().catch((error: unknown) => {
  console.error("Schema initialization failed:", error instanceof Error ? error.message : "Unexpected error");
  process.exitCode = 1;
});
