"use client";
import Link from "next/link";
import { useState } from "react";
import { services, price, naira } from "@/lib/catalog";
export default function Book() {
  const [service, setService] = useState("chat");
  return (
    <main id="main" className="prose-page">
      <p className="eyebrow">YOUR CONSULTATION</p>
      <h1>
        Make time
        <br />
        <em>for your health.</em>
      </h1>
      <div className="progress-steps" aria-label="Booking stages">
        <strong>01 Account</strong>
        <span>02 Consultation</span>
        <span>03 Availability</span>
        <span>04 Intake</span>
        <span>05 Payment</span>
        <span>06 Confirmation</span>
      </div>
      <div className="booking-demo-invite">
        <div>
          <p className="eyebrow">CLIENT PRESENTATION</p>
          <h3>Take the consultation experience for a spin.</h3>
          <p>
            A complete walkthrough with a fictional patient, sample slots and
            simulated checkout.
          </p>
        </div>
        <Link className="button" href="/demo/consultation">
          Try the consultation demo →
        </Link>
      </div>
      <div className="notice" role="status">
        <strong>Consultations are not open for booking yet.</strong>
        <p>
          Verified doctor details, account services and a published schedule are
          required before we can accept bookings. No payment will be collected.
        </p>
      </div>
      <Link className="text-link" href="/account">
        Explore your account options →
      </Link>
      <h2 style={{ marginTop: 30 }}>Explore your options</h2>
      <div className="booking-options">
        {services.map((s) => (
          <button
            className="booking-option"
            aria-pressed={service === s.id}
            key={s.id}
            disabled={s.id === "physical"}
            onClick={() => setService(s.id)}
          >
            <strong>{s.name}</strong>
            <span>
              {naira(price(s.regular))} <del>{naira(s.regular)}</del>
            </span>
            <span>
              {s.id === "physical" ? "Clinic verification pending" : s.delivery}
            </span>
          </button>
        ))}
      </div>
      <p>
        Scheduled consultations are not for medical emergencies. Seek immediate
        local emergency care if you need urgent help.
      </p>
    </main>
  );
}
