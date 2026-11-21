import type { Metadata } from "next";
import { ConsultationDemo } from "@/components/consultation-demo";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Consultation demo",
  robots: { index: false, follow: false },
};
export default function Page() {
  const dates = Array.from({ length: 4 }, (_, i) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + i + 2);
    return date.toISOString().slice(0, 10);
  });
  return <ConsultationDemo dates={dates} />;
}
