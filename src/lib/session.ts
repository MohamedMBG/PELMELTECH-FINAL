/**
 * Server-only session helpers for route handlers. Resolves the signed cookie
 * to the current user and enforces per-section permissions.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, ROOT_USER_ID, getSecret, verifyToken } from "@/lib/auth";
import { getUserById, ALL_PERMISSIONS, type Permission, type PublicUser } from "@/lib/server-store";

export type SessionUser = PublicUser;

const ROOT_USER: SessionUser = {
  id: ROOT_USER_ID,
  username: "admin",
  name: "Administrator",
  role: "superadmin",
  permissions: [...ALL_PERMISSIONS],
  createdAt: "",
  updatedAt: "",
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await verifyToken(getSecret(), token);
  if (!userId) return null;
  if (userId === ROOT_USER_ID) return ROOT_USER;

  const user = await getUserById(userId);
  if (!user) return null;
  const { passwordHash: _h, ...pub } = user;
  return pub.role === "superadmin" ? { ...pub, permissions: [...ALL_PERMISSIONS] } : pub;
}

export function can(user: SessionUser | null, perm: Permission): boolean {
  return !!user && (user.role === "superadmin" || user.permissions.includes(perm));
}

export async function hasPerm(perm: Permission): Promise<boolean> {
  return can(await getSessionUser(), perm);
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
