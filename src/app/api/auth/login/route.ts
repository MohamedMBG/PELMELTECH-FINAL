import { NextResponse } from "next/server";
import { SESSION_COOKIE, ROOT_USER_ID, getSecret, getPassword, createToken, safeEqual, verifyPassword } from "@/lib/auth";
import { getUserByUsername } from "@/lib/server-store";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));
  if (typeof password !== "string" || !password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const name = typeof username === "string" ? username.trim() : "";
  let userId: string | null = null;

  // Bootstrap superadmin: blank username or "admin" + the env password.
  if ((!name || name.toLowerCase() === "admin") && safeEqual(password, getPassword())) {
    userId = ROOT_USER_ID;
  } else if (name) {
    const user = await getUserByUsername(name);
    if (user && (await verifyPassword(password, user.passwordHash))) userId = user.id;
  }

  if (!userId) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createToken(getSecret(), userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
