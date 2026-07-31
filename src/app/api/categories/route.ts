import { NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/server-store";
import { hasPerm, forbidden } from "@/lib/session";

// Database-backed: never statically evaluate at build (fail-closed on DB).
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCategories());
}

export async function POST(req: Request) {
  if (!(await hasPerm("categories"))) return forbidden();
  const data = await req.json();
  return NextResponse.json(await createCategory(data), { status: 201 });
}
