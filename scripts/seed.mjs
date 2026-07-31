/**
 * RETIRED. The previous implementation destructively pruned products and
 * categories that were absent from src/data/*.json, which could delete
 * admin-created rows. It has been replaced by a single, safer implementation.
 *
 * Use instead:
 *   npm run seed:initial            # safe upsert, never deletes
 *   npm run seed:sync:destructive   # guarded prune (flag + confirmation, not prod)
 *
 * This wrapper does nothing except tell you that and exit non-zero.
 */

console.error(
  "scripts/seed.mjs is retired. Use `npm run seed:initial` (safe) or " +
    "`npm run seed:sync:destructive` (guarded destructive prune).",
);
process.exit(1);
