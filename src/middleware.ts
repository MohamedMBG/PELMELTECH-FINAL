import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, getSecret, verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  // Public contact form may create quotes anonymously; everything else that
  // mutates data requires a session.
  const isPublicWrite = req.method === "POST" && pathname === "/api/quotes";
  const isWriteApi =
    pathname.startsWith("/api") &&
    req.method !== "GET" &&
    !pathname.startsWith("/api/auth") &&
    !isPublicWrite;

  if (!isAdminPage && !isWriteApi) return NextResponse.next();

  const authed = await verifyToken(getSecret(), req.cookies.get(SESSION_COOKIE)?.value);
  if (authed) return NextResponse.next();

  if (isWriteApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
