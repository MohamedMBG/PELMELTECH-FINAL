import { createCipheriv, randomBytes, scryptSync } from "node:crypto";
import { strToU8, zipSync } from "fflate";
import type { BackupSnapshot } from "@/lib/server-store";

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

interface EncryptedEnvelope {
  format: "pelmeltech-aes-256-gcm";
  version: 1;
  keyDerivation: "scrypt";
  salt: string;
  iv: string;
  authTag: string;
  ciphertext: string;
}

export interface BackupArchive {
  bytes: Uint8Array;
  filename: string;
  counts: Record<keyof BackupSnapshot["data"], number>;
}

export function createEncryptedBackupArchive(
  snapshot: BackupSnapshot,
  passphrase: string,
): BackupArchive {
  if (passphrase.length < 32) {
    throw new Error("BACKUP_ENCRYPTION_KEY must contain at least 32 characters");
  }

  const plaintext = Buffer.from(JSON.stringify(snapshot), "utf8");
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = scryptSync(passphrase, salt, 32);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);

  const envelope: EncryptedEnvelope = {
    format: "pelmeltech-aes-256-gcm",
    version: 1,
    keyDerivation: "scrypt",
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };

  const counts = {
    products: snapshot.data.products.length,
    categories: snapshot.data.categories.length,
    quotes: snapshot.data.quotes.length,
    devis: snapshot.data.devis.length,
    users: snapshot.data.users.length,
  };
  const date = snapshot.exportedAt.slice(0, 10);
  const bytes = zipSync(
    {
      "pelmeltech-backup.enc.json": strToU8(JSON.stringify(envelope)),
      "manifest.json": strToU8(
        JSON.stringify(
          {
            formatVersion: snapshot.formatVersion,
            exportedAt: snapshot.exportedAt,
            encrypted: true,
            encryption: envelope.format,
            counts,
          },
          null,
          2,
        ),
      ),
      "RESTORE.txt": strToU8(
        [
          "PelmelTech encrypted database backup",
          "",
          "Keep the BACKUP_ENCRYPTION_KEY separate from this archive.",
          "To decrypt and verify:",
          "  npm run backup:decrypt -- path/to/this-file.zip path/to/output.json",
          "",
          "The command only creates a verified JSON export. It does not overwrite the live database.",
        ].join("\n"),
      ),
    },
    { level: 9 },
  );

  if (bytes.byteLength > MAX_ATTACHMENT_BYTES) {
    throw new Error(
      `Encrypted backup is ${bytes.byteLength} bytes; email delivery is limited to ${MAX_ATTACHMENT_BYTES} bytes`,
    );
  }

  return {
    bytes,
    filename: `pelmeltech-database-${date}.zip`,
    counts,
  };
}

interface SendBackupEmailInput {
  apiKey: string;
  from: string;
  to: string;
  archive: BackupArchive;
  exportedAt: string;
}

export async function sendBackupEmail(input: SendBackupEmailInput): Promise<string> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `pelmeltech-monthly-backup-${input.exportedAt.slice(0, 7)}`,
    },
    body: JSON.stringify({
      from: input.from,
      to: [input.to],
      subject: `PelmelTech encrypted database backup — ${input.exportedAt.slice(0, 10)}`,
      text: [
        "The scheduled PelmelTech database backup is attached.",
        "",
        `Created: ${input.exportedAt}`,
        `Products: ${input.archive.counts.products}`,
        `Categories: ${input.archive.counts.categories}`,
        `Quotes: ${input.archive.counts.quotes}`,
        `Devis: ${input.archive.counts.devis}`,
        `Users: ${input.archive.counts.users}`,
        "",
        "This archive is encrypted. Keep the encryption key separate and secure.",
      ].join("\n"),
      attachments: [
        {
          filename: input.archive.filename,
          content: Buffer.from(input.archive.bytes).toString("base64"),
        },
      ],
      tags: [{ name: "type", value: "monthly-database-backup" }],
    }),
  });

  const result = (await response.json().catch(() => null)) as
    | { id?: string; message?: string; error?: { message?: string } }
    | null;
  if (!response.ok || !result?.id) {
    throw new Error(
      `Backup email failed (${response.status}): ${result?.message || result?.error?.message || "unknown error"}`,
    );
  }
  return result.id;
}
