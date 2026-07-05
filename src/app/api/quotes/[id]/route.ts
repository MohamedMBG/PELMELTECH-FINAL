import { NextResponse } from "next/server";
import { updateQuoteStatus, deleteQuote } from "@/lib/server-store";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const { status } = await req.json();
  const updated = await updateQuoteStatus(id, status);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return NextResponse.json({ ok: await deleteQuote(id) });
}
