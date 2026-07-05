import { NextResponse } from "next/server";
import { SESSION_COOKIE, getSecret, getPassword, createToken, safeEqual } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  const expected = getPassword();
  const ok = typeof password === "string" && safeEqual(password, expected);
  if (!ok) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createToken(getSecret()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
