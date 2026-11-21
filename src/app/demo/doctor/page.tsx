import type { Metadata } from "next";
import { DoctorDemo } from "@/components/doctor-demo";
export const metadata: Metadata = {
  title: "Doctor workspace demo",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <DoctorDemo />;
}
