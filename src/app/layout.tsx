import type { Metadata } from "next";
import { Header, Footer } from "@/components/site";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Kemville — Care, with you in mind.",
    template: "%s | Kemville",
  },
  description:
    "Thoughtful, doctor-led consultations. Explore WhatsApp, telephone, video and in-person care.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
