import { NextResponse } from "next/server";
import { getUsers, getUserByUsername, createUser } from "@/lib/server-store";
import { hasPerm, forbidden } from "@/lib/session";

export async function GET() {
  if (!(await hasPerm("users"))) return forbidden();
  return NextResponse.json(await getUsers());
}

export async function POST(req: Request) {
  if (!(await hasPerm("users"))) return forbidden();
  const data = await req.json().catch(() => ({}));

  const username = String(data.username || "").trim();
  const password = String(data.password || "");
  if (!username || password.length < 6) {
    return NextResponse.json({ error: "Username and a password of 6+ characters are required" }, { status: 400 });
  }
  if (await getUserByUsername(username)) {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }

  const user = await createUser({
    username,
    name: String(data.name || ""),
    password,
    role: data.role === "superadmin" ? "superadmin" : "member",
    permissions: Array.isArray(data.permissions) ? data.permissions : [],
  });
  return NextResponse.json(user, { status: 201 });
}
