import { NextResponse } from "next/server";
import { getDevisList, createDevis } from "@/lib/server-store";
import { hasPerm, forbidden } from "@/lib/session";
import type { DevisItem } from "@/lib/admin-types";

export async function GET() {
  if (!(await hasPerm("quotes"))) return forbidden();
  return NextResponse.json(await getDevisList());
}

export async function POST(req: Request) {
  if (!(await hasPerm("quotes"))) return forbidden();
  const data = await req.json();

  if (!data.customerName) {
    return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
  }
  const items: DevisItem[] = Array.isArray(data.items)
    ? data.items
        .map((it: Partial<DevisItem>) => ({
          description: String(it.description || "").slice(0, 300),
          quantity: Math.max(0, Number(it.quantity) || 0),
          unitPrice: Math.max(0, Number(it.unitPrice) || 0),
        }))
        .filter((it: DevisItem) => it.description)
    : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "At least one line item is required" }, { status: 400 });
  }

  const devis = await createDevis({
    customerName: String(data.customerName).slice(0, 200),
    company: String(data.company || "").slice(0, 200),
    email: String(data.email || "").slice(0, 200),
    phone: String(data.phone || "").slice(0, 60),
    address: String(data.address || "").slice(0, 400),
    items,
    taxRate: Math.max(0, Math.min(100, Number(data.taxRate) || 0)),
    notes: String(data.notes || "").slice(0, 2000),
  });
  return NextResponse.json(devis, { status: 201 });
}
