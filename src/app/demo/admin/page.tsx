import type { Metadata } from "next";
import { AdminDemo } from "@/components/admin-demo";
export const metadata: Metadata = {
  title: "Admin workspace demo",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <AdminDemo />;
}
