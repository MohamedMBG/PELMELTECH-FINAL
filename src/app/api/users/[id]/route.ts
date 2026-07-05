import { NextResponse } from "next/server";
import { updateUser, deleteUser } from "@/lib/server-store";
import { getSessionUser, can, forbidden } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const me = await getSessionUser();
  if (!can(me, "users")) return forbidden();
  const { id } = await params;
  const data = await req.json().catch(() => ({}));

  // Don't let someone strip their own users permission and lock themselves out.
  if (me!.id === id && data.role === "member" && Array.isArray(data.permissions) && !data.permissions.includes("users")) {
    return NextResponse.json({ error: "You cannot remove your own user-management access" }, { status: 400 });
  }

  const updated = await updateUser(id, {
    name: data.name,
    password: data.password || undefined,
    role: data.role === "superadmin" ? "superadmin" : "member",
    permissions: Array.isArray(data.permissions) ? data.permissions : undefined,
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const me = await getSessionUser();
  if (!can(me, "users")) return forbidden();
  const { id } = await params;
  if (me!.id === id) return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  return NextResponse.json({ ok: await deleteUser(id) });
}
