import { randomUUID } from "node:crypto";
function required(key: string) {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
}
export async function sendEmail(to: string, subject: string, text: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${required("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: required("EMAIL_FROM"), to, subject, text }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Email provider rejected delivery");
  return response.json() as Promise<{ id: string }>;
}
export async function initializePayment(input: {
  reference: string;
  email: string;
  amountKobo: number;
}) {
  const key = required("PAYSTACK_SECRET_KEY");
  if (!key.startsWith("sk_test_"))
    throw new Error("Only test payments are enabled");
  if (!Number.isSafeInteger(input.amountKobo) || input.amountKobo <= 0)
    throw new Error("Invalid amount");
  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reference: input.reference,
        email: input.email,
        amount: input.amountKobo,
        currency: "NGN",
        callback_url: `${required("APP_URL")}/dashboard`,
      }),
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok) throw new Error("Payment initialization failed");
  return response.json() as Promise<{
    status: boolean;
    data: { authorization_url: string; reference: string };
  }>;
}
export async function createMeet(input: {
  reference: string;
  startsAt: Date;
  endsAt: Date;
  accessToken: string;
}) {
  if (
    process.env.GOOGLE_MEET_ENABLED !== "true" ||
    process.env.GOOGLE_PRIVACY_REVIEW_APPROVED !== "true"
  )
    throw new Error("Video integration is disabled");
  const calendar = encodeURIComponent(required("GOOGLE_CALENDAR_ID"));
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendar}/events?conferenceDataVersion=1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: `Kemville consultation ${input.reference}`,
        start: { dateTime: input.startsAt.toISOString() },
        end: { dateTime: input.endsAt.toISOString() },
        conferenceData: {
          createRequest: {
            requestId: randomUUID(),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      }),
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok)
    throw new Error("Calendar creation failed; retry through outbox");
  return response.json() as Promise<{ id: string; hangoutLink?: string }>;
}
export function whatsappLink(reference: string) {
  const number = required("WHATSAPP_BUSINESS_NUMBER");
  if (!/^\d{8,15}$/.test(number)) throw new Error("Invalid practice number");
  return `https://wa.me/${number}?text=${encodeURIComponent(`Kemville booking reference: ${reference}`)}`;
}
