import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { db } from "./db";
export const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export const token = () => randomBytes(32).toString("base64url");
export async function currentUser() {
  const value = (await cookies()).get("kemville_session")?.value;
  if (!value) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: digest(value) },
    include: { user: { include: { profile: true } } },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}
export async function createSession(userId: string) {
  const value = token();
  await db.session.create({
    data: {
      userId,
      tokenHash: digest(value),
      expiresAt: new Date(Date.now() + 86400000),
    },
  });
  (await cookies()).set("kemville_session", value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400,
  });
}
