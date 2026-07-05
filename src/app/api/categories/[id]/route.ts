import { NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/lib/server-store";
import { hasPerm, forbidden } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await hasPerm("categories"))) return forbidden();
  const { id } = await params;
  const data = await req.json();
  const updated = await updateCategory(id, data);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await hasPerm("categories"))) return forbidden();
  const { id } = await params;
  return NextResponse.json({ ok: await deleteCategory(id) });
}
