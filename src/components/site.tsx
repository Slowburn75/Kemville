import Link from "next/link";
import { ArrowUpRight, HeartPulse } from "lucide-react";
export function Header() {
  return (
    <header className="header">
      <Link className="brand" href="/" aria-label="Kemville home">
        <HeartPulse size={25} strokeWidth={1.5} />
        kemville<span>®</span>
      </Link>
      <details className="mobile-navigation">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          <Link href="/">Home</Link>
          <Link href="/#services">Services & supplies</Link>
          <Link href="/medical-imaging">Medical imaging</Link>
          <Link href="/pharmaceuticals">Pharmaceuticals</Link>
          <Link href="/equipment">Equipment</Link>
          <Link href="/consumables">Consumables</Link>
          <Link href="/medical-tourism">Medical tourism</Link>
          <Link href="/demo/doctor">Doctor/admin demo</Link>
          <Link href="/account">Sign in</Link>
          <Link href="/book">Book a consultation</Link>
        </nav>
      </details>
      <nav aria-label="Main navigation">
        <Link href="/about">Our approach</Link>
        <Link href="/#services">Services & supplies</Link>
        <Link href="/medical-tourism">Medical tourism</Link>
        <Link href="/how-it-works">How it works</Link>
        <Link href="/account">Sign in</Link>
      </nav>
      <Link href="/book" className="button small">
        Book a consultation <ArrowUpRight size={16} />
      </Link>
    </header>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Link className="brand" href="/">
            kemville®
          </Link>
          <p>Thoughtful care. Wherever you are.</p>
        </div>
        <div>
          <Link href="/about">About Kemville</Link>
          <Link href="/medical-imaging">Medical imaging</Link>
          <Link href="/equipment">Equipment</Link>
          <Link href="/pharmaceuticals">Pharmaceuticals</Link>
          <Link href="/consumables">Consumables</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms of care</Link>
          <Link href="/cancellation-policy">Cancellation policy</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kemville</span>
        <span>
          Scheduled care is not emergency care. Seek urgent local help in an
          emergency.
        </span>
      </div>
    </footer>
  );
}
