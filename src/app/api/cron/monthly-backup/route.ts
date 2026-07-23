import { NextResponse } from "next/server";
import { safeEqual } from "@/lib/auth";
import { createEncryptedBackupArchive, sendBackupEmail } from "@/lib/backup";
import { createBackupSnapshot } from "@/lib/server-store";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization") || "";
  const expected = cronSecret ? `Bearer ${cronSecret}` : "";

  if (!expected || !safeEqual(authorization, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Production exports must never silently fall back to an ephemeral file.
    requiredEnv("DATABASE_URL");
    const snapshot = await createBackupSnapshot();
    const archive = createEncryptedBackupArchive(
      snapshot,
      requiredEnv("BACKUP_ENCRYPTION_KEY"),
    );
    const emailId = await sendBackupEmail({
      apiKey: requiredEnv("RESEND_API_KEY"),
      from: requiredEnv("BACKUP_EMAIL_FROM"),
      to: requiredEnv("BACKUP_EMAIL_TO"),
      archive,
      exportedAt: snapshot.exportedAt,
    });

    return NextResponse.json({
      ok: true,
      exportedAt: snapshot.exportedAt,
      filename: archive.filename,
      counts: archive.counts,
      deliveryId: emailId,
    });
  } catch (error) {
    console.error("Monthly database backup failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Backup failed" },
      { status: 500 },
    );
  }
}
