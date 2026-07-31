import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createToken,
  verifyToken,
  signTokenWithExpiry,
  safeEqual,
  safeCompareSecret,
  hashPassword,
  verifyPassword,
  ROOT_USER_ID,
  SESSION_TTL_MS,
} from "../src/lib/auth";

const SECRET = "test-signing-secret-abcdefgh";

// --- Session signing / validation ---

test("a valid unexpired signed token is accepted", async () => {
  const token = await createToken(SECRET, ROOT_USER_ID);
  assert.equal(await verifyToken(SECRET, token), ROOT_USER_ID);
});

test("a validly signed but expired token is rejected", async () => {
  // Genuinely signed with the real secret, but with a past expiry.
  const expired = await signTokenWithExpiry(SECRET, ROOT_USER_ID, Date.now() - 1000);
  assert.equal(await verifyToken(SECRET, expired), null);
});

test("a malformed token is rejected", async () => {
  assert.equal(await verifyToken(SECRET, undefined), null);
  assert.equal(await verifyToken(SECRET, ""), null);
  assert.equal(await verifyToken(SECRET, "not-a-token"), null);
  assert.equal(await verifyToken(SECRET, "a.b"), null);
});

test("a token with a modified (future) expiry but stale signature is rejected", async () => {
  const future = Date.now() + SESSION_TTL_MS;
  const token = await signTokenWithExpiry(SECRET, ROOT_USER_ID, future);
  const sig = token.split(".")[2];
  // Extend the expiry further into the future while keeping the old signature.
  const tampered = `${ROOT_USER_ID}.${future + 60_000}.${sig}`;
  assert.equal(await verifyToken(SECRET, tampered), null);
});

test("a token signed with another secret is rejected", async () => {
  const token = await createToken(SECRET, ROOT_USER_ID);
  assert.equal(await verifyToken("some-other-secret", token), null);
});

test("a tampered userId is rejected", async () => {
  const token = await createToken(SECRET, ROOT_USER_ID);
  const parts = token.split(".");
  assert.equal(await verifyToken(SECRET, `attacker.${parts[1]}.${parts[2]}`), null);
});

test("safeEqual is correct", () => {
  assert.equal(safeEqual("abc", "abc"), true);
  assert.equal(safeEqual("abc", "abd"), false);
  assert.equal(safeEqual("abc", "abcd"), false);
});

// --- Fixed-length password comparison (no length side channel) ---

test("safeCompareSecret accepts the correct password", async () => {
  assert.equal(await safeCompareSecret("hunter2-correct", "hunter2-correct"), true);
});

test("safeCompareSecret rejects an incorrect same-length password", async () => {
  assert.equal(await safeCompareSecret("hunter2-correct", "hunter2-wrong!!"), false);
});

test("safeCompareSecret rejects an incorrect different-length password", async () => {
  assert.equal(await safeCompareSecret("short", "a-much-longer-password"), false);
});

test("safeCompareSecret rejects an empty password against a real one", async () => {
  assert.equal(await safeCompareSecret("", "real-password"), false);
});

test("safeCompareSecret handles unicode input", async () => {
  assert.equal(await safeCompareSecret("pÅsswörd-🔐", "pÅsswörd-🔐"), true);
  assert.equal(await safeCompareSecret("pÅsswörd-🔐", "password"), false);
});

// --- PBKDF2 password hashing (member accounts) ---

test("password hashing round-trips and rejects wrong passwords", async () => {
  const stored = await hashPassword("correct horse battery staple");
  assert.equal(await verifyPassword("correct horse battery staple", stored), true);
  assert.equal(await verifyPassword("wrong password", stored), false);
});
