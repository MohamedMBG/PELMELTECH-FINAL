import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateConfig,
  getAdminPassword,
  getAdminSecret,
  isFileStoreAllowed,
  ConfigError,
} from "../src/lib/config";

const PROD = {
  NODE_ENV: "production",
  ADMIN_PASSWORD: "a-strong-enough-password",
  ADMIN_SECRET: "a-sufficiently-long-secret-value",
  DATABASE_URL: "postgresql://u:p@localhost:5432/db",
} as NodeJS.ProcessEnv;

function withEnv(env: NodeJS.ProcessEnv, fn: () => void) {
  const saved = process.env;
  process.env = { ...env } as NodeJS.ProcessEnv;
  try {
    fn();
  } finally {
    process.env = saved;
  }
}

test("production rejects missing ADMIN_PASSWORD", () => {
  const errs = validateConfig({ ...PROD, ADMIN_PASSWORD: undefined }, { production: true });
  assert.ok(errs.some((e) => e.level === "error" && e.variable === "ADMIN_PASSWORD"));
});

test("production rejects missing ADMIN_SECRET", () => {
  const errs = validateConfig({ ...PROD, ADMIN_SECRET: undefined }, { production: true });
  assert.ok(errs.some((e) => e.level === "error" && e.variable === "ADMIN_SECRET"));
});

test("production rejects missing DATABASE_URL", () => {
  const errs = validateConfig({ ...PROD, DATABASE_URL: undefined }, { production: true });
  assert.ok(errs.some((e) => e.level === "error" && e.variable === "DATABASE_URL"));
});

test("production rejects known insecure fallback values", () => {
  const errs = validateConfig(
    { ...PROD, ADMIN_PASSWORD: "admin", ADMIN_SECRET: "dev-insecure-secret-change-me" },
    { production: true },
  );
  assert.ok(errs.some((e) => e.variable === "ADMIN_PASSWORD" && e.level === "error"));
  assert.ok(errs.some((e) => e.variable === "ADMIN_SECRET" && e.level === "error"));
});

test("valid production config produces no errors", () => {
  const errs = validateConfig(PROD, { production: true }).filter((e) => e.level === "error");
  assert.equal(errs.length, 0);
});

test("DATABASE_URL format is validated", () => {
  const errs = validateConfig({ ...PROD, DATABASE_URL: "mysql://x" }, { production: true });
  assert.ok(errs.some((e) => e.variable === "DATABASE_URL" && e.level === "error"));
});

test("validateConfig never echoes secret values", () => {
  const secret = "super-secret-do-not-leak-1234567";
  const errs = validateConfig({ ...PROD, ADMIN_SECRET: secret, DATABASE_URL: "mysql://leak" });
  const blob = JSON.stringify(errs);
  assert.ok(!blob.includes(secret));
  assert.ok(!blob.includes("mysql://leak"));
});

test("getters throw in production when credentials are missing", () => {
  withEnv({ NODE_ENV: "production" } as NodeJS.ProcessEnv, () => {
    assert.throws(() => getAdminPassword(), ConfigError);
    assert.throws(() => getAdminSecret(), ConfigError);
  });
});

test("getters throw in production for insecure placeholder values", () => {
  withEnv(
    { NODE_ENV: "production", ADMIN_PASSWORD: "admin", ADMIN_SECRET: "dev-insecure-secret-change-me" } as NodeJS.ProcessEnv,
    () => {
      assert.throws(() => getAdminPassword(), ConfigError);
      assert.throws(() => getAdminSecret(), ConfigError);
    },
  );
});

test("development allows fallback credentials and file store", () => {
  withEnv({ NODE_ENV: "development" } as NodeJS.ProcessEnv, () => {
    assert.equal(getAdminPassword(), "admin");
    assert.equal(getAdminSecret(), "dev-insecure-secret-change-me");
    assert.equal(isFileStoreAllowed(), true);
  });
});

test("production forbids the JSON file store", () => {
  withEnv(PROD, () => assert.equal(isFileStoreAllowed(), false));
});

test("production forbids the file store even during next build (no build bypass)", () => {
  withEnv(
    { ...PROD, NEXT_PHASE: "phase-production-build" } as NodeJS.ProcessEnv,
    () => assert.equal(isFileStoreAllowed(), false),
  );
});
