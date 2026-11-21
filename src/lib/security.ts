import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHmac,
  timingSafeEqual,
  scrypt as scryptCallback,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback);
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}
export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, salt, hash] = encoded.split(":");
  if (algorithm !== "scrypt" || !salt || !hash) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  return (
    expected.length === derived.length && timingSafeEqual(expected, derived)
  );
}
export function encrypt(value: unknown, key: Buffer, context: string) {
  if (key.length !== 32) throw new Error("Encryption key must be 32 bytes");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(context));
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), ciphertext]
    .map((b) => b.toString("base64url"))
    .join(".");
}
export function decrypt(value: string, key: Buffer, context: string) {
  const [iv, tag, data] = value
    .split(".")
    .map((v) => Buffer.from(v, "base64url"));
  const cipher = createDecipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(context));
  cipher.setAuthTag(tag);
  return JSON.parse(
    Buffer.concat([cipher.update(data), cipher.final()]).toString("utf8"),
  ) as unknown;
}
function matches(value: string, expected: string) {
  if (!/^[a-f0-9]{128}$/i.test(value)) return false;
  return timingSafeEqual(
    Buffer.from(value, "hex"),
    Buffer.from(expected, "hex"),
  );
}
export function verifyWebhook(
  body: string,
  header: string,
  secret: string,
  now = Date.now(),
) {
  const fields = header.split(",");
  const timestamp = fields.find((f) => f.startsWith("t="))?.slice(2);
  if (
    !timestamp ||
    !/^\d+$/.test(timestamp) ||
    Math.abs(now / 1000 - Number(timestamp)) > 300
  )
    return false;
  const expected = createHmac("sha512", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  return fields
    .filter((f) => f.startsWith("v1="))
    .some((f) => matches(f.slice(f.indexOf(":") + 1), expected));
}
export function canReadIntake(
  actor: { id: string; role: string },
  patientUserId: string,
  doctorUserId: string,
) {
  return (
    actor.id === patientUserId ||
    (actor.role === "DOCTOR" && actor.id === doctorUserId)
  );
}
