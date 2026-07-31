import { NextResponse } from "next/server";
import { getHealth } from "@/lib/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { httpStatus, body } = await getHealth();
  return NextResponse.json(body, { status: httpStatus });
}
