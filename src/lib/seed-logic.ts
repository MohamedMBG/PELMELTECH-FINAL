/**
 * Pure decision logic for the seed scripts. Kept free of DB/IO so it can be
 * unit-tested without a database. Determines whether a seed run is allowed to
 * DELETE rows (destructive prune) — which must never happen by accident.
 */

import { isProduction } from "./config";

export interface SeedMode {
  /** Insert/update seed rows. Always true. */
  upsert: true;
  /** Delete rows absent from the JSON source. Only when explicitly requested. */
  prune: boolean;
}

export interface PruneDecision {
  allowed: boolean;
  reason: string;
}

const CONFIRM_ENV = "CONFIRM_DESTRUCTIVE_SEED";
const CONFIRM_VALUE = "yes";

/**
 * Decide whether destructive prune is permitted for this run. Requires BOTH an
 * explicit `--prune` flag AND `CONFIRM_DESTRUCTIVE_SEED=yes`, and refuses in
 * production regardless of flags.
 */
export function resolvePrune(
  argv: string[] = [],
  env: NodeJS.ProcessEnv = process.env,
): PruneDecision {
  const flagged = argv.includes("--prune");
  const confirmed = env[CONFIRM_ENV]?.trim() === CONFIRM_VALUE;

  if (!flagged) {
    return { allowed: false, reason: "no --prune flag; running in safe upsert-only mode" };
  }
  if (isProduction(env)) {
    return { allowed: false, reason: "destructive prune is refused when NODE_ENV=production" };
  }
  if (!confirmed) {
    return { allowed: false, reason: `--prune requires ${CONFIRM_ENV}=${CONFIRM_VALUE} to proceed` };
  }
  return { allowed: true, reason: "prune explicitly requested and confirmed" };
}
