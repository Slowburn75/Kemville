export const services = [
  {
    id: "chat",
    name: "WhatsApp chat",
    regular: 1000000,
    description:
      "A scheduled conversation, with room to put your concerns into words.",
    delivery: "Via WhatsApp",
    icon: "chat",
  },
  {
    id: "voice",
    name: "Voice consultation",
    regular: 1000000,
    description:
      "Talk things through with a doctor, wherever you feel comfortable.",
    delivery: "Doctor calls you",
    icon: "phone",
  },
  {
    id: "video",
    name: "Video consultation",
    regular: 1500000,
    description:
      "A face-to-face conversation, without the journey to a clinic.",
    delivery: "Via Google Meet",
    icon: "video",
  },
  {
    id: "physical",
    name: "In-person consultation",
    regular: 3000000,
    description: "Dedicated time with your doctor in a clinical setting.",
    delivery: "Location to be confirmed",
    icon: "clinic",
  },
] as const;
export function price(kobo: number, percent = 50) {
  if (!Number.isSafeInteger(kobo) || kobo < 0 || percent < 0 || percent > 100)
    throw new Error("Invalid price");
  return Math.round((kobo * (100 - percent)) / 100);
}
export const naira = (kobo: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
