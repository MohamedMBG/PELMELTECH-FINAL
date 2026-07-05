/**
 * Minimal signed-cookie session for the single admin user. No auth library:
 * an HMAC-signed `${expiry}.${sig}` token, verified with Web Crypto so the
 * same code runs in Edge middleware and Node route handlers.
 *
 * ponytail: one shared password (ADMIN_PASSWORD), one secret (ADMIN_SECRET).
 * Add a user table + hashed passwords if you ever need more than one admin.
 */

export const SESSION_COOKIE = "admin_session";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getSecret(): string {
  return process.env.ADMIN_SECRET || "dev-insecure-secret-change-me";
}

export function getPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
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

export async function createToken(secret: string): Promise<string> {
  const exp = String(Date.now() + TTL_MS);
  return `${exp}.${await hmacHex(secret, exp)}`;
}

export async function verifyToken(secret: string, token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Date.now() > Number(exp)) return false;
  return safeEqual(sig, await hmacHex(secret, exp));
}
