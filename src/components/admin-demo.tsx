"use client";
import { useState } from "react";
import { ShieldCheck, CircleAlert } from "lucide-react";
import { DemoWorkspace, WorkspaceNav, Metric } from "./demo-workspace";
import { services, price, naira } from "@/lib/catalog";
const initialPayments = [
  {
    id: "DEMO-PAY-301",
    reference: "DEMO-2101",
    amount: 750000,
    status: "Paid",
    reason: "Matched to sample appointment",
  },
  {
    id: "DEMO-PAY-302",
    reference: "DEMO-2102",
    amount: 500000,
    status: "Paid",
    reason: "Matched to sample appointment",
  },
  {
    id: "DEMO-PAY-303",
    reference: "DEMO-2098",
    amount: 500000,
    status: "Late payment",
    reason: "Reservation expired before payment arrived",
  },
  {
    id: "DEMO-PAY-304",
    reference: "DEMO-2099",
    amount: 750000,
    status: "Failed",
    reason: "Sample checkout was declined",
  },
];
export function AdminDemo() {
  const [tab, setTab] = useState("Overview");
  const [promo, setPromo] = useState(true);
  const [catalog, setCatalog] = useState<
    { id: string; name: string; regular: number; enabled: boolean }[]
  >(
    services.map((s) => ({
      id: s.id,
      name: s.name,
      regular: s.regular,
      enabled: s.id !== "physical",
    })),
  );
  const [payments, setPayments] = useState(initialPayments);
  const [notifications, setNotifications] = useState([
    {
      id: "DEMO-MAIL-01",
      type: "Appointment confirmation",
      reference: "DEMO-2101",
      status: "Delivered (sample)",
    },
    {
      id: "DEMO-MAIL-02",
      type: "Joining instructions",
      reference: "DEMO-2102",
      status: "Retry needed",
    },
  ]);
  const [audit, setAudit] = useState([
    "Demo workspace initialized — sample operational records loaded.",
  ]);
  const [message, setMessage] = useState("");
  const [prices, setPrices] = useState<Record<string, string>>(
    Object.fromEntries(services.map((s) => [s.id, String(s.regular / 100)])),
  );
  function log(text: string) {
    setAudit((all) => [text, ...all]);
    setMessage(text);
  }
  function reset() {
    setTab("Overview");
    setPromo(true);
    setCatalog(
      services.map((s) => ({
        id: s.id,
        name: s.name,
        regular: s.regular,
        enabled: s.id !== "physical",
      })),
    );
    setPrices(
      Object.fromEntries(services.map((s) => [s.id, String(s.regular / 100)])),
    );
    setPayments(initialPayments);
    setNotifications([
      {
        id: "DEMO-MAIL-01",
        type: "Appointment confirmation",
        reference: "DEMO-2101",
        status: "Delivered (sample)",
      },
      {
        id: "DEMO-MAIL-02",
        type: "Joining instructions",
        reference: "DEMO-2102",
        status: "Retry needed",
      },
    ]);
    setAudit([
      "Demo workspace initialized — sample operational records loaded.",
    ]);
    setMessage("");
  }
  const paid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);
  return (
    <DemoWorkspace role="admin" onReset={reset}>
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">THE OPERATIONS WORKSPACE</p>
          <h1>
            Careful oversight.
            <br />
            <em>Confident next steps.</em>
          </h1>
          <p>
            Manage the service experience, with clinical information kept
            separate.
          </p>
        </div>
        <div className="workspace-person">
          <span>KA</span>
          <div>
            <strong>Demo administrator</strong>
            <small>Non-clinical access · simulated controls</small>
          </div>
        </div>
      </div>
      <div className="workspace-metrics">
        <Metric
          label="Sample paid transactions"
          value={naira(paid)}
          detail="Fictional amounts · no actual revenue"
        />
        <Metric
          label="Payment exceptions"
          value={
            payments.filter((p) =>
              ["Late payment", "Refund review"].includes(p.status),
            ).length
          }
          detail="Review without creating bookings"
        />
        <Metric
          label="Launch promotion"
          value={promo ? "50% off" : "Inactive"}
          detail="Demo pricing controls only"
        />
      </div>
      <div className="workspace-layout">
        <WorkspaceNav
          items={[
            "Overview",
            "Services & pricing",
            "Payments",
            "Notifications",
            "Audit records",
          ]}
          active={tab}
          onChange={(t) => {
            setTab(t);
            setMessage("");
          }}
        />
        <section className="workspace-content">
          <div className="workspace-section-heading">
            <div>
              <p className="eyebrow">ADMIN / {tab.toUpperCase()}</p>
              <h2>
                {tab === "Overview"
                  ? "Keep the details in view."
                  : tab === "Services & pricing"
                    ? "A clear offer, carefully managed."
                    : tab === "Payments"
                      ? "Every payment accounted for."
                      : tab === "Notifications"
                        ? "The right message, at the right time."
                        : "A record of every change."}
              </h2>
            </div>
            <span className="demo-badge">SIMULATION</span>
          </div>
          {tab === "Overview" && (
            <>
              <div className="workspace-privacy">
                <ShieldCheck size={24} />
                <div>
                  <h3>Operational access, with clear boundaries.</h3>
                  <p>
                    This non-clinical admin demo contains booking references,
                    prices and delivery status. Medical intake and clinical
                    notes are not included in this workspace.
                  </p>
                </div>
              </div>
              <div className="admin-overview-grid">
                <article>
                  <p className="eyebrow">NEEDS ATTENTION</p>
                  <h3>One late sample payment</h3>
                  <p>
                    The hold expired before payment success. Review an exception
                    instead of confirming an unavailable appointment.
                  </p>
                  <button
                    className="text-link"
                    onClick={() => setTab("Payments")}
                  >
                    Review sample exception →
                  </button>
                </article>
                <article>
                  <p className="eyebrow">SERVICE READINESS</p>
                  <h3>In-person care is paused</h3>
                  <p>
                    Verified clinic details and an operating schedule are
                    required. The sample physical service stays disabled.
                  </p>
                  <button
                    className="text-link"
                    onClick={() => setTab("Services & pricing")}
                  >
                    View service settings →
                  </button>
                </article>
                <article>
                  <p className="eyebrow">COMMUNICATIONS</p>
                  <h3>One notification to retry</h3>
                  <p>
                    Preview retry handling without contacting an email provider
                    or sending messages.
                  </p>
                  <button
                    className="text-link"
                    onClick={() => setTab("Notifications")}
                  >
                    Review notifications →
                  </button>
                </article>
              </div>
            </>
          )}
          {tab === "Services & pricing" && (
            <>
              <div className="admin-promotion">
                <div>
                  <span className="eyebrow">INTRODUCTORY OFFER</span>
                  <h3>50% off consultations</h3>
                  <p>
                    Change the sample prices below. Existing sample payments
                    retain their original amounts.
                  </p>
                </div>
                <button
                  className="button"
                  aria-pressed={promo}
                  onClick={() => {
                    setPromo(!promo);
                    log(
                      `Demo launch promotion ${promo ? "disabled" : "enabled"}.`,
                    );
                  }}
                >
                  {promo ? "Disable demo promotion" : "Enable demo promotion"}
                </button>
              </div>
              <div className="admin-service-list">
                {catalog.map((s) => (
                  <article key={s.id}>
                    <div>
                      <h3>{s.name}</h3>
                      <span className="demo-badge">
                        {s.enabled ? "Enabled in demo" : "Disabled"}
                      </span>
                      <p>
                        {s.id === "physical"
                          ? "Clinic verification and schedule pending"
                          : `Sample patient price: ${naira(price(s.regular, promo ? 50 : 0))}`}
                      </p>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const value = Number(prices[s.id]);
                        if (
                          !Number.isSafeInteger(value) ||
                          value < 100 ||
                          value > 10000000
                        ) {
                          setMessage(
                            "Enter a whole naira amount between 100 and 10,000,000.",
                          );
                          return;
                        }
                        setCatalog((all) =>
                          all.map((item) =>
                            item.id === s.id
                              ? { ...item, regular: value * 100 }
                              : item,
                          ),
                        );
                        log(`Demo regular price updated for ${s.name}.`);
                      }}
                    >
                      <label>
                        Regular price (NGN)
                        <input
                          type="number"
                          min="100"
                          max="10000000"
                          step="1"
                          required
                          value={prices[s.id]}
                          onChange={(e) =>
                            setPrices({ ...prices, [s.id]: e.target.value })
                          }
                        />
                      </label>
                      <button className="button">Save demo price</button>
                    </form>
                    <button
                      className="text-link"
                      disabled={s.id === "physical"}
                      onClick={() => {
                        setCatalog((all) =>
                          all.map((item) =>
                            item.id === s.id
                              ? { ...item, enabled: !item.enabled }
                              : item,
                          ),
                        );
                        log(
                          `Demo ${s.name} ${s.enabled ? "disabled" : "enabled"}.`,
                        );
                      }}
                    >
                      {s.id === "physical"
                        ? "Clinic required"
                        : s.enabled
                          ? "Disable service"
                          : "Enable service"}
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
          {tab === "Payments" && (
            <>
              <p className="workspace-inline-notice">
                <CircleAlert size={18} />
                Fictional transactions. Actions never call Paystack, charge a
                card or issue a refund.
              </p>
              <div className="admin-payment-list">
                {payments.map((p) => (
                  <article key={p.id}>
                    <div>
                      <h3>{p.id}</h3>
                      <p>{p.reference}</p>
                      <span className="demo-badge">{p.status}</span>
                    </div>
                    <div>
                      <strong>{naira(p.amount)}</strong>
                      <p>{p.reason}</p>
                    </div>
                    <div>
                      {p.status === "Late payment" && (
                        <button
                          className="button"
                          onClick={() => {
                            setPayments((all) =>
                              all.map((item) =>
                                item.id === p.id
                                  ? { ...item, status: "Refund review" }
                                  : item,
                              ),
                            );
                            log(
                              `Demo ${p.id} moved to refund review. No appointment confirmed.`,
                            );
                          }}
                        >
                          Review late payment
                        </button>
                      )}
                      {["Paid", "Refund review"].includes(p.status) && (
                        <button
                          className="text-link"
                          onClick={() => {
                            setPayments((all) =>
                              all.map((item) =>
                                item.id === p.id
                                  ? { ...item, status: "Refund queued (demo)" }
                                  : item,
                              ),
                            );
                            log(
                              `Demo refund queued for ${p.id}. No actual refund issued.`,
                            );
                          }}
                        >
                          Queue demo refund
                        </button>
                      )}
                      {p.status === "Failed" && (
                        <span className="demo-muted">
                          No funds collected (sample)
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
          {tab === "Notifications" && (
            <>
              <p className="demo-muted">
                Sample delivery status. No email addresses, medical answers or
                external deliveries are used.
              </p>
              {notifications.map((n) => (
                <article className="admin-notification" key={n.id}>
                  <div>
                    <h3>{n.type}</h3>
                    <p>
                      {n.id} · {n.reference}
                    </p>
                    <span className="demo-badge">{n.status}</span>
                  </div>
                  {n.status === "Retry needed" && (
                    <button
                      className="button"
                      onClick={() => {
                        setNotifications((all) =>
                          all.map((item) =>
                            item.id === n.id
                              ? { ...item, status: "Retry simulated" }
                              : item,
                          ),
                        );
                        log(
                          `Demo retry simulated for ${n.id}. No message sent.`,
                        );
                      }}
                    >
                      Simulate retry
                    </button>
                  )}
                </article>
              ))}
            </>
          )}
          {tab === "Audit records" && (
            <>
              <p className="demo-muted">
                Changes made in this admin demo only. No medical notes or intake
                content are recorded here.
              </p>
              <ol className="admin-audit">
                {audit.map((a, i) => (
                  <li key={`${i}-${a}`}>
                    <span>{String(audit.length - i).padStart(2, "0")}</span>
                    <div>
                      <strong>Demo administrator</strong>
                      <p>{a}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
          {message && (
            <p role="status" className="demo-feedback">
              {message}
            </p>
          )}
        </section>
      </div>
    </DemoWorkspace>
  );
}
