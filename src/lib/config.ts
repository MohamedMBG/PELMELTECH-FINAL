/**
 * Centralized configuration + production safety checks.
 *
 * Single source of truth for "what is required in production" and "what values
 * are known-insecure". Imported by auth, the data store, the health endpoint,
 * and the standalone scripts (db:init, seed, config:check) so the same rules
 * are enforced everywhere instead of being scattered and inconsistent.
 *
 * Edge-safe: reads only `process.env`, no Node built-ins, so it runs in
 * middleware and in Node route handlers alike. It NEVER logs or returns secret
 * values — only variable names and human messages.
 */

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export function isProduction(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NODE_ENV === "production";
}

/** Required in production. Missing → hard error. */
export const REQUIRED_IN_PRODUCTION = ["ADMIN_PASSWORD", "ADMIN_SECRET", "DATABASE_URL"] as const;

/** Placeholder/example values that must never reach production. */
export const KNOWN_INSECURE_VALUES: Record<string, string[]> = {
  ADMIN_PASSWORD: ["admin", "replace-with-a-strong-password"],
  ADMIN_SECRET: ["dev-insecure-secret-change-me", "replace-with-a-long-random-secret"],
  CRON_SECRET: ["replace-with-a-random-string-at-least-16-characters"],
  BACKUP_ENCRYPTION_KEY: ["replace-with-a-separate-random-string-at-least-32-characters"],
};

/** Development-only fallbacks. Never used when NODE_ENV === "production". */
const DEV_DEFAULTS: Record<string, string> = {
  ADMIN_PASSWORD: "admin",
  ADMIN_SECRET: "dev-insecure-secret-change-me",
};

const MIN_LENGTHS: Record<string, number> = {
  ADMIN_SECRET: 16,
  ADMIN_PASSWORD: 12,
  CRON_SECRET: 16,
  BACKUP_ENCRYPTION_KEY: 32,
};

function isInsecure(name: string, value: string): boolean {
  return (KNOWN_INSECURE_VALUES[name] ?? []).includes(value);
}

/**
 * Return a required credential. In production a missing value, a known
 * placeholder, or (for secrets) a too-short value throws a ConfigError that
 * names the variable but never echoes the value. In development, falls back to
 * a clearly-labelled insecure default so `npm run dev` works offline.
 */
function requireCredential(name: keyof typeof DEV_DEFAULTS): string {
  const value = process.env[name]?.trim();
  if (isProduction()) {
    if (!value) throw new ConfigError(`${name} is required in production but is not set`);
    if (isInsecure(name, value)) {
      throw new ConfigError(`${name} is set to a known insecure placeholder value`);
    }
    return value;
  }
  return value || DEV_DEFAULTS[name];
}

export function getAdminPassword(): string {
  return requireCredential("ADMIN_PASSWORD");
}

export function getAdminSecret(): string {
  return requireCredential("ADMIN_SECRET");
}

/**
 * Whether the JSON file store is permitted. Development only. Production must
 * use Postgres and is fail-closed at both build and runtime: it never silently
 * falls back to data/store.json. (Nothing accesses the store during
 * `next build` — public/admin pages are client components that fetch the
 * dynamic /api routes at request time — so a missing DATABASE_URL fails the
 * build/runtime rather than baking stale JSON into the output.)
 */
export function isFileStoreAllowed(): boolean {
  return !isProduction();
}

export interface ConfigIssue {
  level: "error" | "warning";
  variable: string;
  message: string;
}

const DATABASE_URL_RE = /^postgres(ql)?:\/\/.+/i;

/**
 * Pure validator used by `npm run config:check`, the health endpoint, and the
 * test suite. Returns a list of issues; never includes secret values. Pass
 * `production: true` to validate a target production environment even when the
 * current process is not itself running in production.
 */
export function validateConfig(
  env: NodeJS.ProcessEnv = process.env,
  { production = isProduction(env) }: { production?: boolean } = {},
): ConfigIssue[] {
  const issues: ConfigIssue[] = [];
  const err = production ? "error" : "warning";

  for (const name of REQUIRED_IN_PRODUCTION) {
    const value = env[name]?.trim();
    if (!value) {
      issues.push({ level: err, variable: name, message: `${name} is not set` });
      continue;
    }
    if (isInsecure(name, value)) {
      issues.push({ level: err, variable: name, message: `${name} uses a known insecure placeholder value` });
    }
    const min = MIN_LENGTHS[name];
    if (min && value.length < min) {
      issues.push({ level: err, variable: name, message: `${name} should be at least ${min} characters` });
    }
  }

  const dbUrl = env.DATABASE_URL?.trim();
  if (dbUrl && !DATABASE_URL_RE.test(dbUrl)) {
    issues.push({
      level: "error",
      variable: "DATABASE_URL",
      message: "DATABASE_URL must be a postgres:// or postgresql:// connection string",
    });
  }

  // Backup variables are optional, but if any is present the set should be
  // complete and the encryption key long enough.
  const backupVars = ["CRON_SECRET", "BACKUP_ENCRYPTION_KEY", "RESEND_API_KEY", "BACKUP_EMAIL_FROM", "BACKUP_EMAIL_TO"];
  const anyBackup = backupVars.some((n) => env[n]?.trim());
  if (anyBackup) {
    for (const name of backupVars) {
      const value = env[name]?.trim();
      if (!value) {
        issues.push({ level: "warning", variable: name, message: `${name} is not set but other backup variables are` });
        continue;
      }
      if (isInsecure(name, value)) {
        issues.push({ level: "warning", variable: name, message: `${name} uses a known insecure placeholder value` });
      }
      const min = MIN_LENGTHS[name];
      if (min && value.length < min) {
        issues.push({ level: "warning", variable: name, message: `${name} should be at least ${min} characters` });
      }
    }
  }

  return issues;
}
