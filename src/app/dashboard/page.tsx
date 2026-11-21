import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import { db } from "@/lib/db";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function Dashboard() {
  if (!process.env.DATABASE_URL)
    return (
      <main id="main" className="prose-page">
        <h1>
          Account services
          <br />
          are being prepared.
        </h1>
        <p>A connected database is required to access patient accounts.</p>
      </main>
    );
  const user = await currentUser();
  if (!user) redirect("/account");
  if (user.role !== "PATIENT") redirect("/account");
  const appointments = user.profile
    ? await db.appointment.findMany({
        where: { patientId: user.profile.id },
        orderBy: { startsAt: "desc" },
        select: { id: true, reference: true, startsAt: true, status: true },
      })
    : [];
  return (
    <main id="main" className="prose-page">
      <p className="eyebrow">PATIENT OVERVIEW</p>
      <h1>
        Welcome,
        <br />
        <em>{user.profile?.fullName ?? "to Kemville"}.</em>
      </h1>
      <h2>Your appointments</h2>
      {appointments.length ? (
        appointments.map((a) => (
          <article className="notice" key={a.id}>
            <strong>{a.reference}</strong>
            <p>
              {a.startsAt.toISOString()} · {a.status}
            </p>
          </article>
        ))
      ) : (
        <div className="notice">
          <p>
            You have no appointments yet. Booking opens when a verified schedule
            is available.
          </p>
          <Link className="text-link" href="/book">
            Explore consultations →
          </Link>
        </div>
      )}
    </main>
  );
}
