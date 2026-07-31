/**
 * Signed-cookie session. No auth library: an HMAC-signed
 * `${userId}.${expiry}.${sig}` token, verified with Web Crypto so the same
 * code runs in Edge middleware and Node route handlers.
 *
 * The env admin (ADMIN_PASSWORD) logs in as the bootstrap superadmin with the
 * reserved userId "root". Additional accounts live in the users table with
 * PBKDF2-hashed passwords and per-section permissions.
 */

import { getAdminPassword, getAdminSecret } from "@/lib/config";

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const TTL_MS = SESSION_TTL_MS;

/**
 * Session-signing secret. Delegates to the centralized config, which requires
 * a real value in production and only falls back to an insecure default in
 * development. Never returns the insecure default when NODE_ENV=production.
 */
export function getSecret(): string {
  return getAdminSecret();
}

/** Bootstrap superadmin password. Required in production (see config). */
export function getPassword(): string {
  return getAdminPassword();
}

const enc = new TextEncoder();

async function hmacHex(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time compare of two equal-length hex strings. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sha256Hex(msg: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(msg));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Constant-time secret comparison with no length side channel. Both inputs are
 * reduced to fixed-length SHA-256 digests before the constant-time compare, so
 * neither the values nor their lengths leak. Edge-compatible (Web Crypto), so
 * it is usable from middleware. Never logs either value.
 */
export async function safeCompareSecret(a: string, b: string): Promise<boolean> {
  return safeEqual(await sha256Hex(a), await sha256Hex(b));
}

/** Reserved id for the env-configured bootstrap superadmin. */
export const ROOT_USER_ID = "root";

/** Sign a token with an explicit absolute expiry (ms since epoch). */
async function signToken(secret: string, userId: string, expiresAtMs: number): Promise<string> {
  const payload = `${userId}.${expiresAtMs}`;
  return `${payload}.${await hmacHex(secret, payload)}`;
}

export async function createToken(secret: string, userId: string = ROOT_USER_ID): Promise<string> {
  return signToken(secret, userId, Date.now() + TTL_MS);
}

/**
 * Test-only helper: sign a valid token with a caller-chosen expiry so tests can
 * construct genuinely-signed expired/future tokens. Not used by production code
 * and does not weaken verifyToken.
 */
export async function signTokenWithExpiry(
  secret: string,
  userId: string,
  expiresAtMs: number,
): Promise<string> {
  return signToken(secret, userId, expiresAtMs);
}

/** Returns the userId if the token is valid and unexpired, else null. */
export async function verifyToken(secret: string, token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  if (!userId || !exp || !sig) return null;
  if (Date.now() > Number(exp)) return null;
  const ok = safeEqual(sig, await hmacHex(secret, `${userId}.${exp}`));
  return ok ? userId : null;
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/**
 * PBKDF2-SHA256 password hash. Stored as `${saltHex}:${hashHex}`. Web Crypto
 * only, so it runs in both Node and Edge runtimes.
 */
export async function hashPassword(password: string, saltHex?: string): Promise<string> {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 100_000, hash: "SHA-256" },
    key,
    256,
  );
  return `${bytesToHex(salt)}:${bytesToHex(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const computed = (await hashPassword(password, saltHex)).split(":")[1];
  return safeEqual(computed, hashHex);
}
