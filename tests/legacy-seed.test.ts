import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test("the retired scripts/seed.mjs exits non-zero and points to the new commands", () => {
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "seed.mjs")], {
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0, "retired script must exit non-zero");
  assert.match(result.stderr, /seed:initial/);
  assert.match(result.stderr, /retired/i);
});
