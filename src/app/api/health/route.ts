import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "pelmeltech-api",
    timestamp: new Date().toISOString(),
  });
}
