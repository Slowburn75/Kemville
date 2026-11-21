import { OfferingPage } from "@/components/offerings";
import { offerings } from "@/lib/offerings";
import { notFound } from "next/navigation";
import Link from "next/link";
const pages: Record<string, { title: string; body: string[] }> = {
  about: {
    title: "Care begins with listening.",
    body: [
      "Kemville brings together doctor-led consultations, medical imaging, pharmaceutical enquiries, equipment and consumables procurement, and medical tourism planning. Each service is subject to verified providers, availability and appropriate clinical review.",
      "Verified doctor qualifications, professional registration and biography are pending publication. Consultations will not open before this information is verified.",
    ],
  },
  consultations: {
    title: "Choose your way to connect.",
    body: [
      "WhatsApp chat: ₦10,000 regular / ₦5,000 launch. Voice: ₦10,000 regular / ₦5,000 launch. Video: ₦15,000 regular / ₦7,500 launch. Physical: ₦30,000 regular / ₦15,000 launch.",
      "The introductory 50% promotion remains active until an administrator disables it. Final prices must be calculated by the server before checkout. Physical consultations are unavailable until a verified clinic and schedule are configured.",
    ],
  },
  "how-it-works": {
    title: "A considered path to care.",
    body: [
      "Create and verify your adult patient account. Complete your medical profile, choose a consultation format, then select a time from the doctor’s published availability.",
      "Complete your appointment-specific questionnaire, review consent and pay securely through Paystack. Your appointment is confirmed only after the server verifies payment.",
      "Video consultations use Google Meet. For telephone consultations, the doctor calls you. WhatsApp consultations use the official practice number with only your reference in the prefilled message.",
    ],
  },
  faq: {
    title: "A few helpful answers.",
    body: [
      "Is this an emergency service? No. Seek immediate local emergency care for urgent or life-threatening concerns.",
      "Can children register? Adult self-registration only; a guardian consent workflow is not yet available.",
      "Is in-person booking available? Not until a clinic location and operating schedule are verified.",
      "When are consultations opening? Booking depends on verified clinician details, published availability and tested payment and delivery configuration.",
    ],
  },
  contact: {
    title: "Get in touch.",
    body: [
      "The official support email, practice telephone number and response hours are awaiting business verification. They will be published here before bookings open.",
      "Please do not send medical records through unsecured support channels. This website is not monitored for emergencies.",
    ],
  },
  privacy: {
    title: "Your privacy matters.",
    body: [
      "Draft privacy information — requires approval before patient registration opens.",
      "The planned service collects identity, contact, health profile, appointment intake and payment references to provide and administer consultations. Payment card details are handled by the payment provider.",
      "Medical intake must be encrypted, limited to the patient and authorized clinical personnel, and excluded from ordinary emails, calendar descriptions and WhatsApp messages.",
      "Controller identity, legal bases, retention periods, international transfer safeguards, subprocessors and rights request contact are pending legal and operational review. No claim of regulatory compliance is made.",
    ],
  },
  terms: {
    title: "Terms of care.",
    body: [
      "Draft terms — not approved for production use.",
      "Consultations are scheduled and prepaid. They are not an emergency service. Doctor identity and professional registration must be verified before clinical services open.",
      "Adult accounts only. Patients should provide accurate information. Suitability for remote consultation is a clinical decision; in-person assessment may be necessary.",
      "Governing terms, complaints handling and clinical escalation procedures require business and legal approval.",
    ],
  },
  "cancellation-policy": {
    title: "Plans can change.",
    body: [
      "Draft policy — cancellation windows, rescheduling limits and refund eligibility require business approval before checkout opens.",
      "Payment verification does not override slot availability. A payment received after an expired hold must enter reconciliation rather than creating an overlapping appointment.",
      "Approved refund timing and a verified support contact will be published before paid bookings are enabled.",
    ],
  },
};
export function generateStaticParams() {
  return [
    ...new Set([...Object.keys(pages), ...offerings.map((o) => o.slug)]),
  ].map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title:
      pages[slug]?.title ??
      offerings.find((o) => o.slug === slug)?.label ??
      "Not found",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== "consultations" && offerings.some((o) => o.slug === slug))
    return <OfferingPage slug={slug} />;
  const p = pages[slug];
  if (!p) notFound();
  return (
    <main id="main" className="prose-page">
      <p className="eyebrow">
        KEMVILLE / {slug.replaceAll("-", " ").toUpperCase()}
      </p>
      <h1>{p.title}</h1>
      {p.body.map((t) => (
        <p key={t}>{t}</p>
      ))}
      <Link className="text-link" href="/book">
        Explore consultations →
      </Link>
    </main>
  );
}
