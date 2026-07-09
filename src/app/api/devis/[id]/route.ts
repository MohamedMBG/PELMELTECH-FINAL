import { NextResponse } from "next/server";
import { getDevis, updateDevis, deleteDevis } from "@/lib/server-store";
import { hasPerm, forbidden } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!(await hasPerm("quotes"))) return forbidden();
  const { id } = await params;
  const devis = await getDevis(id);
  if (!devis) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(devis);
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await hasPerm("quotes"))) return forbidden();
  const { id } = await params;
  const patch = await req.json();
  const updated = await updateDevis(id, patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await hasPerm("quotes"))) return forbidden();
  const { id } = await params;
  return NextResponse.json({ ok: await deleteDevis(id) });
}
