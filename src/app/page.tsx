import { Offerings } from "@/components/offerings";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  MessageCircle,
  Phone,
  Video,
  Building2,
  ShieldCheck,
  Clock3,
  HeartHandshake,
  Plus,
} from "lucide-react";
import { services, naira, price } from "@/lib/catalog";
const icons = [MessageCircle, Phone, Video, Building2];
export default function Home() {
  return (
    <main id="main">
      <div className="offer-bar">
        A little welcome, from us. <strong>50% off consultations</strong>
        <span>Introductory offer</span>
        <ArrowUpRight size={14} />
      </div>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="dot" /> PERSONAL HEALTHCARE. THOUGHTFULLY
            DELIVERED.
          </p>
          <h1>
            Care, with <em>you</em>
            <br />
            in mind.
          </h1>
          <p className="lead">
            Your health deserves time, attention, and a doctor who listens.
            Connect with care that fits into your life.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/book">
              Find your consultation <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" href="/how-it-works">
              How it works <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-note">
            <ShieldCheck size={19} />
            <span>Private conversations. Personal attention.</span>
          </div>
        </div>
        <div className="hero-photo">
          <Image
            fill
            sizes="(max-width: 650px) 90vw, 45vw"
            priority
            unoptimized
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=85"
            alt="Doctor listening during a consultation"
          />
          <div className="photo-caption">
            <span>A SPACE TO BE HEARD</span>
            <p>
              Good care starts with
              <br />a conversation.
            </p>
            <ArrowUpRight size={25} />
          </div>
        </div>
      </section>
      <div className="trust-strip">
        <span>Care that meets you where you are</span>
        <span>
          <MessageCircle size={17} /> Chat
        </span>
        <span>
          <Phone size={17} /> Voice
        </span>
        <span>
          <Video size={17} /> Video
        </span>
        <span>
          <Building2 size={17} /> In person
        </span>
      </div>
      <section className="section" id="consultations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR HEALTH. YOUR WAY.</p>
            <h2>
              A little closer to
              <br />
              <em>feeling better.</em>
            </h2>
          </div>
          <p>
            Choose how you’d like to connect.
            <br />
            We’ll make time for what matters to you.
          </p>
        </div>
        <div className="service-grid">
          {services.map((s, i) => {
            const Icon = icons[i];
            return (
              <article className="service-card" key={s.id}>
                <div className="card-top">
                  <Icon strokeWidth={1.4} size={27} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <span className="delivery">{s.delivery}</span>
                <div className="pricing">
                  <strong>{naira(price(s.regular))}</strong>
                  <del>{naira(s.regular)}</del>
                  <span>50% OFF</span>
                </div>
                {s.id === "physical" ? (
                  <span className="unavailable">
                    Coming when our clinic is ready
                  </span>
                ) : (
                  <Link className="card-link" href={"/book?service=" + s.id}>
                    Choose {s.id === "chat" ? "chat" : s.id}{" "}
                    <ArrowUpRight size={18} />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
        <p className="fine-print">
          Launch prices shown. The introductory offer remains available until
          withdrawn. All consultations are prepaid.
        </p>
      </section>
      <Offerings />
      <section className="doctor-section">
        <div className="doctor-art">
          <HeartHandshake size={84} strokeWidth={0.7} />
          <span>DOCTOR PROFILE</span>
          <p>
            A personal introduction,
            <br />
            coming soon.
          </p>
        </div>
        <div>
          <p className="eyebrow">A PERSON, BEFORE A PATIENT</p>
          <h2>
            Medical care.
            <br />
            <em>Human connection.</em>
          </h2>
          <p className="lead">
            We believe a consultation should leave room for questions. For
            context. For the things you’ve been meaning to bring up.
          </p>
          <p>
            Our doctor’s verified biography, qualifications and registration
            details will be published before consultations open.
          </p>
          <Link className="text-link" href="/about">
            Get to know Kemville <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LESS FRICTION. MORE CARE.</p>
            <h2>
              Your next step,
              <br />
              <em>made simple.</em>
            </h2>
          </div>
          <Link className="text-link" href="/how-it-works">
            The details <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="steps">
          {[
            [
              "01",
              "Choose your consultation",
              "Find the format that works for you and select an available time.",
            ],
            [
              "02",
              "Tell us what’s on your mind",
              "Create your secure account and share a little about your health.",
            ],
            [
              "03",
              "Make time for yourself",
              "Pay securely, receive confirmation, and connect with your doctor.",
            ],
          ].map(([n, t, d]) => (
            <div key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="why">
        <p className="eyebrow">THE KEMVILLE APPROACH</p>
        <h2>
          Small details.
          <br />
          <em>A more considered kind of care.</em>
        </h2>
        <div className="values">
          {[
            [
              ShieldCheck,
              "Privacy, by design",
              "Your health story deserves careful handling and clear consent.",
            ],
            [
              Clock3,
              "Time that’s yours",
              "Scheduled appointments, with a format that fits your day.",
            ],
            [
              HeartHandshake,
              "Care that listens",
              "Space to share your concerns and discuss your next steps.",
            ],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof ShieldCheck;
            return (
              <div key={String(t)}>
                <I size={29} strokeWidth={1.2} />
                <h3>{String(t)}</h3>
                <p>{String(d)}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="section faq-section">
        <div>
          <p className="eyebrow">A FEW THINGS TO KNOW</p>
          <h2>
            Good questions.
            <br />
            <em>Clear answers.</em>
          </h2>
          <Link className="text-link" href="/faq">
            All questions <ArrowUpRight size={17} />
          </Link>
        </div>
        <div>
          {[
            [
              "Is this for medical emergencies?",
              "No. Scheduled consultations are not an emergency service. If you need immediate help, go to your nearest emergency department or contact local emergency services.",
            ],
            [
              "How will I speak to the doctor?",
              "Choose WhatsApp chat, a doctor-initiated telephone call, or Google Meet video. In-person appointments will open only after a clinic and schedule are verified.",
            ],
            [
              "How does the introductory offer work?",
              "The launch promotion reduces regular consultation prices by 50%. The final amount will be shown before payment.",
            ],
            [
              "Can I book for a child?",
              "Self-registration is restricted to adults. A guardian and consent workflow must be approved before bookings for minors are supported.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Plus size={18} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="final-cta">
        <p className="eyebrow">MAKE SPACE FOR YOUR HEALTH</p>
        <h2>
          Let’s start with
          <br />
          <em>a conversation.</em>
        </h2>
        <Link href="/book" className="button light">
          Explore consultations <ArrowUpRight size={18} />
        </Link>
        <p>Introductory consultations from ₦5,000</p>
      </section>
    </main>
  );
}
