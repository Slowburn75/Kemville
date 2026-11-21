import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Stethoscope, Pill, PackageCheck } from "lucide-react";
import { offerings, conditionGroups } from "@/lib/offerings";
import { ProcurementList } from "./procurement-list";
export function Offerings() {
  return (
    <section className="section offerings-section" id="services">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE WIDER PICTURE OF HEALTH</p>
          <h2>
            Care, supplies,
            <br />
            <em>and your next step.</em>
          </h2>
        </div>
        <p>
          From a first conversation to specialist care.
          <br />
          Explore the Kemville service directory.
        </p>
      </div>
      <div className="offering-grid">
        {offerings.map((o, i) => (
          <Link className="offering-card" key={o.slug} href={"/" + o.slug}>
            <div className="offering-visual">
              {"image" in o ? (
                <Image
                  src={o.image}
                  alt={
                    o.label === "Medical equipment"
                      ? "Ultrasound equipment"
                      : "Medical imaging equipment"
                  }
                  fill
                  sizes="(max-width:650px) 90vw, 30vw"
                />
              ) : i === 0 ? (
                <Stethoscope size={52} strokeWidth={1} />
              ) : i === 2 ? (
                <Pill size={52} strokeWidth={1} />
              ) : (
                <PackageCheck size={52} strokeWidth={1} />
              )}
            </div>
            <div className="offering-copy">
              <span className="eyebrow">0{i + 1} / EXPLORE</span>
              <h3>
                {o.label}
                <ArrowUpRight size={20} />
              </h3>
              <p>{o.intro}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
export function OfferingPage({ slug }: { slug: string }) {
  const o = offerings.find((o) => o.slug === slug);
  if (!o) return null;
  return (
    <main id="main" className="directory-page">
      <div className="directory-hero">
        <div>
          <p className="eyebrow">KEMVILLE / {o.label.toUpperCase()}</p>
          <h1>{o.label}</h1>
          <p className="lead">{o.intro}</p>
          <Link className="text-link" href="/#services">
            Explore all services <ArrowUpRight size={16} />
          </Link>
        </div>
        {"image" in o && (
          <div className="directory-photo">
            <Image
              src={o.image}
              alt={
                o.label === "Medical equipment"
                  ? "Ultrasound system with probes"
                  : "Medical imaging scanner"
              }
              fill
              sizes="(max-width:650px) 90vw, 45vw"
            />
          </div>
        )}
      </div>
      {slug === "medical-tourism" ? (
        <>
          <div className="notice">
            <strong>
              Specialist care starts with an individual assessment.
            </strong>
            <p>
              The conditions below are enquiry topics, not a promise of
              treatment or acceptance. Partner hospitals, destinations, costs
              and care coordination are not yet confirmed. Travel arrangements
              are not currently available.
            </p>
          </div>
          <p className="eyebrow">CONDITIONS & SPECIALTIES</p>
          <h2>
            Explore areas for
            <br />
            <em>specialist review.</em>
          </h2>
          <div className="condition-grid">
            {conditionGroups.map((g) => (
              <article key={g.specialty}>
                <h3>{g.specialty}</h3>
                <ul>
                  {g.conditions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="tourism-next">
            <h2>Before making travel plans</h2>
            <p>
              Discuss suitability, treatment risks, recovery, travel timing and
              follow-up with your treating clinician. Overseas care requires
              careful provider verification and a plan for care when you return.
            </p>
            <a
              className="text-link"
              href="https://www.cdc.gov/yellow-book/hcp/health-care-abroad/medical-tourism.html"
              target="_blank"
              rel="noreferrer"
            >
              Read CDC guidance on medical tourism <ArrowUpRight size={16} />
            </a>
          </div>
        </>
      ) : "purchase" in o ? (
        <>
          <div className="notice">
            <strong>
              Purchase planning · quotations and checkout are not open yet.
            </strong>
            <p>
              Use the list below to prepare a purchase enquiry. Products,
              suppliers, specifications, stock, prices and delivery terms must
              be verified before an order can be accepted. Nothing is charged or
              submitted here.
            </p>
            {slug === "pharmaceuticals" && (
              <p>
                Prescription items require a valid prescription and pharmacist
                review through an appropriately authorized provider. Do not
                include prescriptions or health details in your procurement
                list.
              </p>
            )}
          </div>
          <ProcurementList items={[...o.items]} />
        </>
      ) : (
        <>
          <h2>Explore {o.label.toLowerCase()}</h2>
          <div className="condition-grid">
            {o.items.map((item) => (
              <article key={item}>
                <h3>{item}</h3>
                <p>
                  Availability and provider details are awaiting verification.
                </p>
              </article>
            ))}
          </div>
          <div className="notice">
            <p>
              Imaging appointments, locations and prices are not yet available.
              Any diagnostic examination requires appropriate clinical
              assessment and referral.
            </p>
          </div>
        </>
      )}
      <div className="directory-end">
        <h3>Start with a medical consultation</h3>
        <p>Explore consultation formats and account options.</p>
        <Link className="button" href="/book">
          Explore consultations <ArrowUpRight size={18} />
        </Link>
      </div>
    </main>
  );
}
