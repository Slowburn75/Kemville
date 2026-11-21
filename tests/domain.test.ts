import { describe, it, expect } from "vitest";
import { createHmac, randomBytes } from "node:crypto";
import { price } from "../src/lib/catalog";
import { ageOn, intakeSchema, registrationSchema } from "../src/lib/validation";
import {
  encrypt,
  decrypt,
  hashPassword,
  verifyPassword,
  verifyWebhook,
  canReadIntake,
} from "../src/lib/security";
import {
  assertTransition,
  assertBookable,
  paymentDisposition,
} from "../src/lib/booking";
describe("pricing", () => {
  it("uses integer kobo and the launch promotion", () => {
    expect(price(1000000)).toBe(500000);
    expect(price(1500000)).toBe(750000);
    expect(price(3000000)).toBe(1500000);
    expect(price(1000000, 0)).toBe(1000000);
    expect(() => price(-1)).toThrow();
  });
});
describe("registration", () => {
  const valid = {
    fullName: "Example Patient",
    email: "patient@example.test",
    password: "long-test-password",
    confirmPassword: "long-test-password",
    birthDate: "1990-05-05",
    sex: "Female",
    phone: "+2348012345678",
    country: "Nigeria",
    state: "Lagos",
    bloodGroup: "Unknown",
    genotype: "Unknown",
    consent: true,
  };
  it("accepts unknown medical attributes", () =>
    expect(registrationSchema.safeParse(valid).success).toBe(true));
  it("rejects minors and mismatched passwords", () => {
    expect(
      registrationSchema.safeParse({ ...valid, birthDate: "2020-01-01" })
        .success,
    ).toBe(false);
    expect(
      registrationSchema.safeParse({ ...valid, confirmPassword: "different" })
        .success,
    ).toBe(false);
  });
  it("calculates age at appointment date", () =>
    expect(ageOn(new Date("2000-11-22"), new Date("2026-11-21"))).toBe(25));
  it("requires all intake answers", () =>
    expect(intakeSchema.safeParse({}).success).toBe(false));
});
describe("security", () => {
  it("hashes passwords with independent salts", async () => {
    const a = await hashPassword("test-password");
    const b = await hashPassword("test-password");
    expect(a).not.toBe(b);
    expect(await verifyPassword("test-password", a)).toBe(true);
    expect(await verifyPassword("wrong", a)).toBe(false);
  });
  it("authenticates ciphertext and record context", () => {
    const key = randomBytes(32);
    const value = encrypt({ concern: "test-only" }, key, "intake:one");
    expect(decrypt(value, key, "intake:one")).toEqual({ concern: "test-only" });
    expect(() => decrypt(value, key, "intake:two")).toThrow();
  });
  it("excludes non-clinical administrators and unrelated patients", () => {
    expect(
      canReadIntake({ id: "admin", role: "ADMIN" }, "patient", "doctor"),
    ).toBe(false);
    expect(
      canReadIntake({ id: "other", role: "PATIENT" }, "patient", "doctor"),
    ).toBe(false);
    expect(
      canReadIntake({ id: "doctor", role: "DOCTOR" }, "patient", "doctor"),
    ).toBe(true);
  });
  it("verifies raw signed webhooks and rejects stale payloads", () => {
    const body = '{"event":"charge.success"}';
    const now = 1760000000000;
    const t = now / 1000;
    const signature = createHmac("sha512", "whsec_test")
      .update(`${t}.${body}`)
      .digest("hex");
    const header = `t=${t},v1=whk_test:${signature}`;
    expect(verifyWebhook(body, header, "whsec_test", now)).toBe(true);
    expect(verifyWebhook(body + " ", header, "whsec_test", now)).toBe(false);
    expect(verifyWebhook(body, header, "whsec_test", now + 301000)).toBe(false);
  });
});
describe("booking safety", () => {
  it("rejects unavailable physical consultations", () =>
    expect(() =>
      assertBookable({ code: "physical", enabled: true }, false),
    ).toThrow());
  it("prevents final-state mutation", () => {
    expect(() => assertTransition("COMPLETED", "CONFIRMED")).toThrow();
    expect(() => assertTransition("CONFIRMED", "CANCELLED")).not.toThrow();
  });
  it("reconciles late success and rejects amount mismatch", () => {
    const input = {
      expiresAt: new Date(1000),
      now: new Date(1000),
      expected: 500000,
      received: 500000,
      currency: "NGN",
      alreadyProcessed: false,
    };
    expect(paymentDisposition(input)).toBe("RECONCILIATION");
    expect(paymentDisposition({ ...input, alreadyProcessed: true })).toBe(
      "DUPLICATE",
    );
    expect(paymentDisposition({ ...input, received: 1 })).toBe("EXCEPTION");
    expect(paymentDisposition({ ...input, now: new Date(999) })).toBe(
      "CONFIRM",
    );
  });
});
