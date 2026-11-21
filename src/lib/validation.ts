import { z } from "zod";
export function ageOn(birthDate: Date, on: Date) {
  let age = on.getUTCFullYear() - birthDate.getUTCFullYear();
  if (
    on.getUTCMonth() < birthDate.getUTCMonth() ||
    (on.getUTCMonth() === birthDate.getUTCMonth() &&
      on.getUTCDate() < birthDate.getUTCDate())
  )
    age--;
  return age;
}
const phone = z
  .string()
  .regex(/^\+?[1-9][0-9]{7,14}$/, "Enter a phone number with country code");
export const registrationSchema = z
  .object({
    fullName: z.string().trim().min(2).max(150),
    email: z
      .email()
      .max(254)
      .transform((v) => v.toLowerCase()),
    password: z.string().min(12).max(128),
    confirmPassword: z.string(),
    birthDate: z.iso
      .date()
      .refine(
        (v) => ageOn(new Date(v), new Date()) >= 18,
        "Adult registration only",
      )
      .refine(
        (v) => ageOn(new Date(v), new Date()) <= 120,
        "Check date of birth",
      ),
    sex: z.enum(["Female", "Male", "Other", "Prefer not to say"]),
    phone,
    country: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    bloodGroup: z.enum([
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
      "Unknown",
    ]),
    genotype: z.enum(["AA", "AS", "AC", "SS", "SC", "CC", "Unknown"]),
    consent: z.literal(true),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });
const answer = z.object({
  response: z.enum(["Yes", "No", "Unknown"]),
  details: z.string().trim().max(2000).optional(),
});
export const intakeSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  age: z.number().int().min(18).max(120),
  sex: z.string().min(1).max(40),
  phone,
  concern: z.string().trim().min(3).max(4000),
  onset: z.string().trim().min(1).max(1000),
  symptoms: z.string().trim().min(1).max(4000),
  conditions: answer,
  medications: answer,
  allergies: answer,
  surgeries: answer,
  goal: z.string().trim().min(3).max(2000),
});
