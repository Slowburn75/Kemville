import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { registrationSchema } from "@/lib/validation";
import { hashPassword, verifyPassword, encrypt } from "@/lib/security";
import { createSession, digest, token } from "@/lib/session";
import { sendEmail } from "@/lib/providers";
export const runtime = "nodejs";
const credentials = z.object({
  email: z.email().transform((v) => v.toLowerCase()),
  password: z.string().min(1).max(128),
});
export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  if (!process.env.DATABASE_URL || !process.env.APP_URL)
    return NextResponse.json(
      { error: "Account services are not configured yet." },
      { status: 503 },
    );
  if (request.headers.get("origin") !== new URL(process.env.APP_URL).origin)
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 },
    );
  if (Number(request.headers.get("content-length") ?? 0) > 20000)
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  const { action } = await params;
  try {
    const raw = await request.text();
    if (raw.length > 20000)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    const body = JSON.parse(raw);
    const email =
      typeof body.email === "string"
        ? body.email.toLowerCase().slice(0, 254)
        : "unknown";
    const bucket = Math.floor(Date.now() / 900000);
    const limit = await db.rateLimit.upsert({
      where: { id: digest(`${action}:${email}:${bucket}`) },
      create: {
        id: digest(`${action}:${email}:${bucket}`),
        expiresAt: new Date(Date.now() + 900000),
      },
      update: { hits: { increment: 1 } },
    });
    if (limit.hits > 8)
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 },
      );
    if (action === "register") {
      if (
        process.env.REGISTRATION_APPROVED !== "true" ||
        !process.env.PRIVACY_POLICY_VERSION ||
        !process.env.RESEND_API_KEY ||
        !process.env.EMAIL_FROM ||
        !/^[a-f0-9]{64}$/i.test(process.env.MEDICAL_ENCRYPTION_KEY ?? "")
      )
        return NextResponse.json(
          {
            error:
              "Registration is awaiting secure email and medical storage configuration.",
          },
          { status: 503 },
        );
      const parsed = registrationSchema.safeParse(body);
      if (!parsed.success)
        return NextResponse.json(
          {
            error: "Please check your registration details.",
            fields: parsed.error.flatten().fieldErrors,
          },
          { status: 400 },
        );
      const v = parsed.data;
      const secret = token();
      const existing = await db.user.findUnique({
        where: { email: v.email },
        select: { id: true },
      });
      if (!existing) {
        const passwordHash = await hashPassword(v.password);
        await db.$transaction(async (tx) => {
          const created = await tx.user.create({
            data: {
              email: v.email,
              passwordHash,
              profile: {
                create: {
                  fullName: v.fullName,
                  birthDate: new Date(v.birthDate),
                  sex: v.sex,
                  phone: v.phone,
                  country: v.country,
                  state: v.state,
                  medical: {
                    create: {
                      encryptedProfile: encrypt(
                        { bloodGroup: v.bloodGroup, genotype: v.genotype },
                        Buffer.from(process.env.MEDICAL_ENCRYPTION_KEY!, "hex"),
                        `profile:${v.email}`,
                      ),
                    },
                  },
                },
              },
              tokens: {
                create: {
                  tokenHash: digest(secret),
                  purpose: "VERIFY",
                  expiresAt: new Date(Date.now() + 3600000),
                },
              },
            },
          });
          await tx.consentRecord.create({
            data: {
              userId: created.id,
              purpose: "HEALTH_DATA_PROCESSING",
              policyVersion: process.env.PRIVACY_POLICY_VERSION!,
              acceptedAt: new Date(),
            },
          });
        });
        await sendEmail(
          v.email,
          "Verify your Kemville email",
          `Verify your email using this one-time code: ${secret}\nEnter it at ${process.env.APP_URL}/account. Expires in one hour.`,
        );
      }
      return NextResponse.json({
        message:
          "If your address is eligible, a verification email has been sent.",
      });
    }
    if (action === "login") {
      const v = credentials.parse(body);
      const user = await db.user.findUnique({ where: { email: v.email } });
      const valid = await verifyPassword(
        v.password,
        user?.passwordHash ??
          "scrypt:00000000000000000000000000000000:" + "00".repeat(64),
      );
      if (!user || !valid || !user.verifiedAt)
        return NextResponse.json(
          {
            error:
              "Unable to sign in. Check your credentials and email verification.",
          },
          { status: 401 },
        );
      if (user.role !== "PATIENT")
        return NextResponse.json(
          { error: "Privileged access requires an approved MFA workflow." },
          { status: 403 },
        );
      await createSession(user.id);
      return NextResponse.json({ message: "Signed in" });
    }
    if (action === "verify" || action === "reset") {
      const v = z
        .object({
          token: z.string().min(30).max(100),
          password: z.string().min(12).max(128).optional(),
        })
        .parse(body);
      if (action === "reset" && !v.password)
        return NextResponse.json(
          { error: "A new password is required" },
          { status: 400 },
        );
      const passwordHash = v.password
        ? await hashPassword(v.password)
        : undefined;
      await db.$transaction(async (tx) => {
        const t = await tx.authToken.findUnique({
          where: { tokenHash: digest(v.token) },
        });
        if (!t || t.purpose !== (action === "verify" ? "VERIFY" : "RESET"))
          throw new Error("Invalid token");
        const consumed = await tx.authToken.updateMany({
          where: { id: t.id, consumedAt: null, expiresAt: { gt: new Date() } },
          data: { consumedAt: new Date() },
        });
        if (consumed.count !== 1) throw new Error("Expired token");
        await tx.user.update({
          where: { id: t.userId },
          data:
            action === "verify" ? { verifiedAt: new Date() } : { passwordHash },
        });
        if (action === "reset")
          await tx.session.deleteMany({ where: { userId: t.userId } });
      });
      return NextResponse.json({
        message:
          action === "verify"
            ? "Email verified. You can now sign in."
            : "Password changed. Please sign in.",
      });
    }
    if (action === "forgot") {
      if (!process.env.RESEND_API_KEY)
        return NextResponse.json(
          { error: "Email service unavailable" },
          { status: 503 },
        );
      const v = z
        .object({ email: z.email().transform((v) => v.toLowerCase()) })
        .parse(body);
      const user = await db.user.findUnique({ where: { email: v.email } });
      if (user) {
        const secret = token();
        await db.authToken.create({
          data: {
            userId: user.id,
            tokenHash: digest(secret),
            purpose: "RESET",
            expiresAt: new Date(Date.now() + 1800000),
          },
        });
        await sendEmail(
          user.email,
          "Reset your Kemville password",
          `Your one-time reset code: ${secret}\nEnter it at ${process.env.APP_URL}/account. Expires in 30 minutes.`,
        );
      }
      return NextResponse.json({
        message: "If the account exists, reset instructions have been sent.",
      });
    }
    if (action === "logout") {
      const jar = await cookies();
      const value = jar.get("kemville_session")?.value;
      if (value)
        await db.session.deleteMany({ where: { tokenHash: digest(value) } });
      jar.delete("kemville_session");
      return NextResponse.json({ message: "Signed out" });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 404 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { error: "Please check the supplied details." },
        { status: 400 },
      );
    return NextResponse.json(
      {
        error:
          "The request could not be completed. Retry or contact support when available.",
      },
      { status: 400 },
    );
  }
}
