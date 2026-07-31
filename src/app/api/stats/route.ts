import { NextResponse } from "next/server";
import { getStats } from "@/lib/server-store";

// Database-backed: never statically evaluate at build (fail-closed on DB).
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getStats());
}
