/**
 * Validate configuration for a production deployment without connecting to any
 * server. Reads variables from the current environment (process.env), so it
 * works whether they come from systemd, the shell, or an optional --env-file.
 *
 * Run:
 *   npm run config:check
 *   node --import tsx --env-file=.env.local scripts/config-check.ts   # optional file
 *
 * Exit code is non-zero when the target production configuration is invalid.
 * Never prints secret values — only variable names and messages.
 */

import { validateConfig } from "../src/lib/config";

// Validate as a production target by default (the point of the command), even
// when this process is not itself running with NODE_ENV=production. Pass --dev
// to validate the current environment mode instead.
const production = !process.argv.includes("--dev");

const issues = validateConfig(process.env, { production });
const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warning");

for (const w of warnings) console.warn(`  warning  ${w.variable}: ${w.message}`);
for (const e of errors) console.error(`  error    ${e.variable}: ${e.message}`);

if (errors.length === 0 && warnings.length === 0) {
  console.log(`Config check passed (${production ? "production" : "development"} target).`);
} else {
  console.log(
    `\nConfig check ${errors.length ? "FAILED" : "passed with warnings"}: ` +
      `${errors.length} error(s), ${warnings.length} warning(s).`,
  );
}

process.exit(errors.length > 0 ? 1 : 0);
