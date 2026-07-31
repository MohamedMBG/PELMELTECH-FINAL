/**
 * Regression guard for the top-level-await / CommonJS transform failure.
 *
 * db-init.ts and seed.ts are launched the same way npm does
 * (`node --import tsx <file>`). Under the project's CommonJS setup, top-level
 * await in these files fails the tsx/esbuild transform. Wrapping the body in
 * main() fixes it; these tests fail if the regression returns.
 *
 * No database is used: DATABASE_URL is removed from the child environment, so
 * each script must fail on missing config *before* any DB connection, proving
 * both that the transform succeeds and that the scripts fail safely.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function launch(rel: string) {
  const env = { ...process.env };
  delete env.DATABASE_URL; // fail on missing config, before any DB mutation
  // Exactly how the npm scripts invoke these files.
  return spawnSync(process.execPath, ["--import", "tsx", rel], {
    cwd: root,
    env,
    encoding: "utf8",
  });
}

for (const script of ["scripts/db-init.ts", "scripts/seed.ts"]) {
  test(`${script} launches with no top-level-await transform error`, () => {
    const { stdout, stderr } = launch(script);
    const combined = `${stdout}\n${stderr}`;
    assert.doesNotMatch(combined, /Top-level await/i, "top-level-await transform error returned");
    assert.doesNotMatch(combined, /TransformError/i, "esbuild TransformError returned");
  });

  test(`${script} fails safely when DATABASE_URL is missing (before any DB work)`, () => {
    const { stderr, status } = launch(script);
    assert.match(stderr, /DATABASE_URL is not set/);
    assert.equal(status, 1);
  });
}
