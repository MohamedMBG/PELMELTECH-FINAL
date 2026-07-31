/**
 * Readiness/health check. Verifies production config and real DB connectivity
 * without ever exposing secrets, connection strings, or stack traces.
 */

import { validateConfig, isProduction } from "@/lib/config";
import { pingDb } from "@/lib/server-store";

export interface HealthResult {
  httpStatus: 200 | 503;
  body: {
    ok: boolean;
    service: "pelmeltech-api";
    config: "ok" | "invalid";
    /** Names of misconfigured variables only — never their values. */
    configErrors?: string[];
    db: { configured: boolean; reachable: boolean; schemaReady: boolean };
    timestamp: string;
  };
}

export async function getHealth(): Promise<HealthResult> {
  const production = isProduction();
  const configErrors = validateConfig(process.env, { production })
    .filter((i) => i.level === "error")
    .map((i) => i.variable);

  const db = await pingDb();

  // Process is "up" if it answered. It is "ready"/healthy only if config is
  // valid and the database is reachable (in production the DB is mandatory).
  const dbHealthy = production ? db.reachable : db.reachable || !db.configured;
  const ok = configErrors.length === 0 && dbHealthy;

  return {
    httpStatus: ok ? 200 : 503,
    body: {
      ok,
      service: "pelmeltech-api",
      config: configErrors.length === 0 ? "ok" : "invalid",
      ...(configErrors.length > 0 ? { configErrors: [...new Set(configErrors)] } : {}),
      db,
      timestamp: new Date().toISOString(),
    },
  };
}
