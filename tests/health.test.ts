import { test } from "node:test";
import assert from "node:assert/strict";

const SECRET_SENTINEL = "sentinel-secret-must-not-leak-123";
// Unreachable on purpose: pingDb should fail fast (connection refused) and
// report the DB as unreachable without ever echoing the connection string.
const DSN_SENTINEL = `postgresql://user:${SECRET_SENTINEL}@127.0.0.1:1/nodb`;

test("health output never exposes secrets or the connection string", async () => {
  process.env.NODE_ENV = "development";
  process.env.ADMIN_SECRET = SECRET_SENTINEL;
  process.env.ADMIN_PASSWORD = SECRET_SENTINEL;
  process.env.DATABASE_URL = DSN_SENTINEL;

  // Import after env is set so the store binds to the sentinel DSN.
  const { getHealth } = await import("../src/lib/health");
  const { httpStatus, body } = await getHealth();

  const blob = JSON.stringify(body);
  assert.ok(!blob.includes(SECRET_SENTINEL), "secret leaked into health body");
  assert.ok(!blob.includes(DSN_SENTINEL), "DSN leaked into health body");
  assert.ok(!blob.includes("127.0.0.1"), "host leaked into health body");

  // Structured, distinguishes process vs DB availability.
  assert.equal(body.service, "pelmeltech-api");
  assert.equal(body.db.reachable, false);
  assert.equal(typeof body.db.configured, "boolean");
  // Unreachable DB → not healthy.
  assert.equal(httpStatus, 503);
});
