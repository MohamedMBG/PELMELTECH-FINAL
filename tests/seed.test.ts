import { test } from "node:test";
import assert from "node:assert/strict";
import { resolvePrune } from "../src/lib/seed-logic";

const DEV = { NODE_ENV: "development" } as NodeJS.ProcessEnv;
const CONFIRM = { ...DEV, CONFIRM_DESTRUCTIVE_SEED: "yes" } as NodeJS.ProcessEnv;

test("default seed run does NOT prune (admin-created rows preserved)", () => {
  assert.equal(resolvePrune([], DEV).allowed, false);
  assert.equal(resolvePrune([], CONFIRM).allowed, false);
});

test("--prune alone is not enough without confirmation", () => {
  assert.equal(resolvePrune(["--prune"], DEV).allowed, false);
});

test("--prune with confirmation is allowed in development", () => {
  assert.equal(resolvePrune(["--prune"], CONFIRM).allowed, true);
});

test("prune is refused in production even with flag and confirmation", () => {
  const prodConfirm = { ...CONFIRM, NODE_ENV: "production" } as NodeJS.ProcessEnv;
  assert.equal(resolvePrune(["--prune"], prodConfirm).allowed, false);
});
