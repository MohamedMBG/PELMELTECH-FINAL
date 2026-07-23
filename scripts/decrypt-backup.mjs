import fs from "node:fs";
import { createDecipheriv, scryptSync } from "node:crypto";
import { unzipSync, strFromU8 } from "fflate";

const [, , archivePath, outputPath] = process.argv;
const passphrase = process.env.BACKUP_ENCRYPTION_KEY;

if (!archivePath || !outputPath) {
  console.error("Usage: npm run backup:decrypt -- backup.zip output.json");
  process.exit(1);
}
if (!passphrase || passphrase.length < 32) {
  console.error("BACKUP_ENCRYPTION_KEY must be set and contain at least 32 characters");
  process.exit(1);
}

const files = unzipSync(new Uint8Array(fs.readFileSync(archivePath)));
const encrypted = files["pelmeltech-backup.enc.json"];
if (!encrypted) {
  console.error("Archive does not contain pelmeltech-backup.enc.json");
  process.exit(1);
}

const envelope = JSON.parse(strFromU8(encrypted));
if (envelope.format !== "pelmeltech-aes-256-gcm" || envelope.version !== 1) {
  console.error("Unsupported backup format");
  process.exit(1);
}

const salt = Buffer.from(envelope.salt, "base64");
const iv = Buffer.from(envelope.iv, "base64");
const authTag = Buffer.from(envelope.authTag, "base64");
const ciphertext = Buffer.from(envelope.ciphertext, "base64");
const key = scryptSync(passphrase, salt, 32);
const decipher = createDecipheriv("aes-256-gcm", key, iv);
decipher.setAuthTag(authTag);
const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
const snapshot = JSON.parse(plaintext.toString("utf8"));

if (snapshot.formatVersion !== 1 || !snapshot.data) {
  console.error("Decrypted content is not a supported PelmelTech backup");
  process.exit(1);
}

fs.writeFileSync(outputPath, JSON.stringify(snapshot, null, 2), { flag: "wx" });
console.log(`Verified backup written to ${outputPath}`);
