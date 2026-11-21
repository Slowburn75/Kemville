"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CalendarDays,
  Clock3,
  ShieldCheck,
  MessageCircle,
  Phone,
  Video,
  Building2,
  RotateCcw,
  CreditCard,
  UserRound,
  FlaskConical,
} from "lucide-react";
import { services, price, naira } from "@/lib/catalog";
import { ageOn, intakeSchema } from "@/lib/validation";
import { z } from "zod";
type Intake = z.infer<typeof intakeSchema>;
const fixture = {
  fullName: "Alex Morgan (demo)",
  birthDate: "1992-04-16",
  sex: "Female",
  phone: "+2348000000000",
  email: "alex@example.test",
  bloodGroup: "Unknown",
  genotype: "Unknown",
  country: "Nigeria",
  state: "Lagos",
};
const sample: Intake = {
  fullName: fixture.fullName,
  age: 34,
  sex: fixture.sex,
  phone: fixture.phone,
  concern: "A routine conversation about my general wellbeing.",
  onset: "For the past two weeks",
  symptoms: "Occasional tiredness — fictional demonstration answer.",
  conditions: { response: "No", details: "" },
  medications: { response: "No", details: "" },
  allergies: { response: "Unknown", details: "" },
  surgeries: { response: "No", details: "" },
  goal: "Discuss my concerns and understand the next steps.",
};
const steps = [
  "Account",
  "Consultation",
  "Availability",
  "Medical intake",
  "Review & payment",
  "Confirmation",
];
const icons = [MessageCircle, Phone, Video, Building2];
const times = ["09:00", "10:00", "11:30", "14:00", "15:30"];
function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(date + "T12:00:00Z"));
}
export function ConsultationDemo({ dates }: { dates: string[] }) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState("video");
  const [profile, setProfile] = useState(fixture);
  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState("10:00");
  const [consent, setConsent] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [payment, setPayment] = useState<
    "idle" | "checkout" | "failed" | "processing" | "paid"
  >("idle");
  const [view, setView] = useState<"wizard" | "patient" | "doctor">("wizard");
  const [status, setStatus] = useState("Confirmed");
  const [reschedule, setReschedule] = useState(false);
  const [message, setMessage] = useState("");
  const title = useRef<HTMLHeadingElement>(null);
  const service = services.find((s) => s.id === serviceId)!;
  const amount = price(service.regular);
  const age = ageOn(new Date(profile.birthDate), new Date(date + "T12:00:00Z"));
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<Intake>({
    resolver: zodResolver(intakeSchema),
    defaultValues: sample,
  });
  function go(next: number) {
    if (next === 3)
      reset({
        ...getValues(),
        fullName: profile.fullName,
        sex: profile.sex,
        phone: profile.phone,
        age,
      });
    setStep(next);
    setMessage("");
  }
  useEffect(() => {
    if (step > 0) {
      title.current?.focus({ preventScroll: true });
      title.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [step]);
  const paymentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (paymentTimer.current) clearTimeout(paymentTimer.current);
    },
    [],
  );
  function restart() {
    if (paymentTimer.current) clearTimeout(paymentTimer.current);
    setStep(0);
    setView("wizard");
    setPayment("idle");
    setConsent(false);
    setPrivacy(false);
    setStatus("Confirmed");
    setServiceId("video");
    setProfile(fixture);
    setDate(dates[0]);
    setTime("10:00");
    setReschedule(false);
    setMessage("");
    reset(sample);
  }
  function nextAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (age < 18 || age > 120) {
      setMessage("Use an adult fictional profile aged 18–120.");
      return;
    }
    reset({
      ...getValues(),
      fullName: profile.fullName,
      sex: profile.sex,
      phone: profile.phone,
      age,
    });
    go(1);
  }
  function pay() {
    setPayment("processing");
    paymentTimer.current = setTimeout(() => {
      setPayment("paid");
      setStatus("Confirmed");
      go(5);
    }, 650);
  }
  function schedule() {
    return (
      <>
        <div className="demo-field-heading">
          <h3>Choose a day</h3>
          <span>Illustrative availability</span>
        </div>
        <div className="demo-dates">
          {dates.map((d) => (
            <button
              type="button"
              key={d}
              aria-pressed={d === date}
              onClick={() => {
                setDate(d);
                if (time === "11:30") setTime("10:00");
              }}
            >
              {dateLabel(d)}
            </button>
          ))}
        </div>
        <div className="demo-field-heading">
          <h3>Choose a time</h3>
          <span>Africa/Lagos · WAT (UTC+1)</span>
        </div>
        <div className="demo-times">
          {times.map((t) => (
            <button
              type="button"
              aria-pressed={t === time}
              key={t}
              disabled={t === "11:30"}
              onClick={() => setTime(t)}
            >
              {t}
              {t === "11:30" && <small>Unavailable</small>}
            </button>
          ))}
        </div>
        <p className="demo-muted">
          <Clock3 size={15} /> 30-minute sample appointment. Slots are fictional
          and are not reserved.
        </p>
      </>
    );
  }
  const instructions =
    serviceId === "video"
      ? "Your video consultation would take place on Google Meet. In the live service, a joining link appears after verified payment and meeting creation."
      : serviceId === "chat"
        ? "You would open a chat with the official practice number using your booking reference. The doctor verifies your identity before the consultation."
        : "Your doctor would call the phone number on your profile at the scheduled time. Please keep your phone available and choose a quiet space.";
  function actions(back: number, next: number, label = "Continue") {
    return (
      <div className="demo-actions">
        <button type="button" className="text-link" onClick={() => go(back)}>
          <ArrowLeft size={16} /> Back
        </button>
        <button className="button" type="button" onClick={() => go(next)}>
          {label}
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }
  return (
    <main id="main" className="demo-page">
      <div className="demo-banner">
        <div>
          <FlaskConical size={18} />
          <span>
            <strong>Client presentation demo</strong> · Fictional data,
            simulated payments. Do not enter real health information.
          </span>
        </div>
        <button onClick={restart}>
          <RotateCcw size={14} /> Reset demo
        </button>
      </div>
      <div className="workspace-role-links">
        <Link href="/demo/consultation" aria-current="page">
          Patient booking
        </Link>
        <Link href="/demo/doctor">Doctor workspace</Link>
        <Link href="/demo/admin">Admin workspace</Link>
      </div>
      <div className="demo-intro">
        <p className="eyebrow">KEMVILLE / A MORE PERSONAL WAY TO CARE</p>
        <h1>
          {view === "wizard" ? (
            <>
              Your consultation,
              <br />
              <em>one thoughtful step at a time.</em>
            </>
          ) : view === "patient" ? (
            <>
              Your care,
              <br />
              <em>all in one place.</em>
            </>
          ) : (
            <>
              Today’s care,
              <br />
              <em>with time to listen.</em>
            </>
          )}
        </h1>
        <p>
          Explore the complete consultation experience. No account, payment or
          appointment is created.
        </p>
      </div>
      {view === "wizard" ? (
        <>
          <ol className="demo-stepper" aria-label="Consultation progress">
            {steps.map((s, i) => (
              <li
                key={s}
                aria-current={i === step ? "step" : undefined}
                className={i <= step ? "active" : ""}
              >
                <span>
                  {i < step ? (
                    <Check size={14} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                {s}
              </li>
            ))}
          </ol>
          <div className="demo-layout">
            <section className="demo-panel" aria-labelledby="demo-title">
              <p className="eyebrow">
                STEP {String(step + 1).padStart(2, "0")} OF 06
              </p>
              <h2 id="demo-title" ref={title} tabIndex={-1}>
                {
                  [
                    "First, a little about you.",
                    "How would you like to connect?",
                    "Find a moment that suits you.",
                    "What’s on your mind?",
                    "A moment to review.",
                    "You’re all set.",
                  ][step]
                }
              </h2>
              {step === 0 && (
                <form onSubmit={nextAccount}>
                  <div className="demo-profile-note">
                    <UserRound size={22} />
                    <div>
                      <strong>Sample patient profile</strong>
                      <p>
                        Prefilled for your presentation. Email verification is
                        simulated.
                      </p>
                    </div>
                    <span className="demo-badge">
                      <Check size={12} /> Demo verified
                    </span>
                  </div>
                  <div className="demo-form-grid">
                    {(
                      [
                        ["fullName", "Full name", "text"],
                        ["email", "Email address", "email"],
                        ["birthDate", "Date of birth", "date"],
                        ["phone", "Phone number", "tel"],
                      ] as const
                    ).map(([key, label, type]) => (
                      <label key={key}>
                        {label}
                        <input
                          type={type}
                          required
                          value={profile[key]}
                          maxLength={150}
                          onChange={(e) =>
                            setProfile({ ...profile, [key]: e.target.value })
                          }
                        />
                      </label>
                    ))}
                    <label>
                      Sex
                      <select
                        value={profile.sex}
                        onChange={(e) =>
                          setProfile({ ...profile, sex: e.target.value })
                        }
                      >
                        {["Female", "Male", "Other", "Prefer not to say"].map(
                          (s) => (
                            <option key={s}>{s}</option>
                          ),
                        )}
                      </select>
                    </label>
                    <label>
                      Blood group
                      <select
                        value={profile.bloodGroup}
                        onChange={(e) =>
                          setProfile({ ...profile, bloodGroup: e.target.value })
                        }
                      >
                        {[
                          "Unknown",
                          "A+",
                          "A-",
                          "B+",
                          "B-",
                          "AB+",
                          "AB-",
                          "O+",
                          "O-",
                        ].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Genotype
                      <select
                        value={profile.genotype}
                        onChange={(e) =>
                          setProfile({ ...profile, genotype: e.target.value })
                        }
                      >
                        {["Unknown", "AA", "AS", "AC", "SS", "SC", "CC"].map(
                          (s) => (
                            <option key={s}>{s}</option>
                          ),
                        )}
                      </select>
                    </label>
                    <label>
                      Country
                      <input
                        required
                        value={profile.country}
                        onChange={(e) =>
                          setProfile({ ...profile, country: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      State of residence
                      <input
                        required
                        value={profile.state}
                        onChange={(e) =>
                          setProfile({ ...profile, state: e.target.value })
                        }
                      />
                    </label>
                  </div>
                  <label className="demo-check">
                    <input
                      type="checkbox"
                      required
                      checked={privacy}
                      onChange={(e) => setPrivacy(e.target.checked)}
                    />
                    I understand this is a demonstration using fictional
                    information.
                  </label>
                  <div className="demo-actions">
                    <span className="demo-muted">
                      Adult sample profiles only
                    </span>
                    <button className="button">
                      Continue to consultation <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}
              {step === 1 && (
                <>
                  <p className="demo-description">
                    The same personal attention, in the format that feels right
                    for you.
                  </p>
                  <div className="demo-service-grid">
                    {services.map((s, i) => {
                      const Icon = icons[i];
                      return (
                        <button
                          key={s.id}
                          type="button"
                          className="demo-service"
                          aria-pressed={serviceId === s.id}
                          disabled={s.id === "physical"}
                          onClick={() => {
                            setServiceId(s.id);
                            setConsent(false);
                          }}
                        >
                          <Icon size={24} strokeWidth={1.3} />
                          <h3>{s.name}</h3>
                          <p>{s.description}</p>
                          <span>{s.delivery}</span>
                          <div>
                            <strong>{naira(price(s.regular))}</strong>{" "}
                            <del>{naira(s.regular)}</del>
                          </div>
                          {s.id === "physical" ? (
                            <small>Clinic verification pending</small>
                          ) : (
                            <small>50% introductory offer</small>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {actions(0, 2, "Choose a time")}
                </>
              )}
              {step === 2 && (
                <>
                  {schedule()}
                  {actions(1, 3, "Continue to intake")}
                </>
              )}
              {step === 3 && (
                <form onSubmit={handleSubmit(() => go(4))}>
                  <p className="demo-description">
                    A short questionnaire helps your doctor prepare. These
                    answers are fictional and stay in this page’s memory.
                  </p>
                  <div className="demo-intake-identity">
                    <span>
                      <small>01 · FULL NAME</small>
                      {profile.fullName}
                    </span>
                    <span>
                      <small>02 · AGE AT APPOINTMENT</small>
                      {age}
                    </span>
                    <span>
                      <small>03 · SEX</small>
                      {profile.sex}
                    </span>
                    <span>
                      <small>04 · PHONE</small>
                      {profile.phone}
                    </span>
                  </div>
                  <button
                    className="text-link"
                    type="button"
                    onClick={() => go(0)}
                  >
                    Correct profile details
                  </button>
                  <div className="demo-questionnaire">
                    {(
                      [
                        ["concern", "05 · What is your main health concern?"],
                        ["onset", "06 · When did the problem start?"],
                        [
                          "symptoms",
                          "07 · What symptoms are you experiencing?",
                        ],
                      ] as const
                    ).map(([key, label]) => (
                      <label key={key}>
                        {label}
                        <textarea rows={2} {...register(key)} />
                        {errors[key] && (
                          <span className="error" role="alert">
                            {errors[key]?.message}
                          </span>
                        )}
                      </label>
                    ))}
                    {(
                      [
                        [
                          "conditions",
                          "08 · Do you have any known medical conditions?",
                        ],
                        [
                          "medications",
                          "09 · Are you currently taking medications or supplements?",
                        ],
                        [
                          "allergies",
                          "10 · Do you have any known drug allergies?",
                        ],
                        [
                          "surgeries",
                          "11 · Have you had previous surgeries or hospital admissions?",
                        ],
                      ] as const
                    ).map(([key, label]) => (
                      <fieldset key={key}>
                        <legend>{label}</legend>
                        <div className="demo-radios">
                          {["Yes", "No", "Unknown"].map((answer) => (
                            <label key={answer}>
                              <input
                                type="radio"
                                value={answer}
                                {...register(`${key}.response`)}
                              />
                              {answer}
                            </label>
                          ))}
                        </div>
                        <label className="demo-muted">
                          Optional details
                          <input
                            maxLength={2000}
                            {...register(`${key}.details`)}
                            placeholder="Fictional details only"
                          />
                        </label>
                      </fieldset>
                    ))}
                    <label>
                      12 · What would you like to achieve from this
                      consultation?
                      <textarea rows={2} {...register("goal")} />
                      {errors.goal && (
                        <span className="error" role="alert">
                          {errors.goal.message}
                        </span>
                      )}
                    </label>
                  </div>
                  <div className="demo-actions">
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => go(2)}
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button className="button">
                      Review consultation <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}
              {step === 4 && (
                <>
                  <div className="demo-review">
                    <div>
                      <span>Patient</span>
                      <strong>{profile.fullName}</strong>
                    </div>
                    <div>
                      <span>Consultation</span>
                      <strong>{service.name}</strong>
                    </div>
                    <div>
                      <span>Date & time</span>
                      <strong>
                        {dateLabel(date)} · {time} WAT
                      </strong>
                    </div>
                    <div>
                      <span>Intake</span>
                      <strong>12 questions completed · demo data</strong>
                    </div>
                  </div>
                  <div className="demo-totals">
                    <p>
                      <span>Regular consultation</span>
                      <span>{naira(service.regular)}</span>
                    </p>
                    <p>
                      <span>Introductory offer · 50%</span>
                      <span>−{naira(service.regular - amount)}</span>
                    </p>
                    <p>
                      <strong>Demo total</strong>
                      <strong>{naira(amount)}</strong>
                    </p>
                  </div>
                  <label className="demo-check">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    I understand this is simulated, scheduled care is not for
                    emergencies, and{" "}
                    {serviceId === "chat"
                      ? "WhatsApp is an external communication platform."
                      : serviceId === "video"
                        ? "video consultations use the external Google Meet service."
                        : "the doctor initiates the telephone call."}
                  </label>
                  {payment === "idle" && (
                    <div className="demo-actions">
                      <button className="text-link" onClick={() => go(3)}>
                        <ArrowLeft size={16} />
                        Back
                      </button>
                      <button
                        className="button"
                        disabled={!consent}
                        onClick={() => setPayment("checkout")}
                      >
                        <CreditCard size={17} />
                        Preview payment
                      </button>
                    </div>
                  )}
                  {["checkout", "failed", "processing"].includes(payment) && (
                    <div
                      className="demo-checkout"
                      aria-label="Simulated checkout"
                    >
                      <span className="demo-badge">SIMULATED CHECKOUT</span>
                      <h3>
                        {payment === "failed"
                          ? "Let’s try that again."
                          : payment === "processing"
                            ? "Simulating confirmation…"
                            : "Complete your demo payment."}
                      </h3>
                      <p role="status">
                        {payment === "failed"
                          ? "The sample payment failed. Your information is preserved; you can retry."
                          : "No payment provider is contacted. No card details or money are collected."}
                      </p>
                      <strong>{naira(amount)} NGN</strong>
                      <div className="demo-actions">
                        <button
                          className="text-link"
                          disabled={payment === "processing"}
                          onClick={() => setPayment("failed")}
                        >
                          Simulate failure
                        </button>
                        <button
                          className="button"
                          disabled={payment === "processing"}
                          onClick={pay}
                        >
                          {payment === "processing"
                            ? "Processing…"
                            : payment === "failed"
                              ? "Retry demo payment"
                              : "Simulate successful payment"}
                        </button>
                      </div>
                      <button
                        className="text-link"
                        disabled={payment === "processing"}
                        onClick={() => setPayment("idle")}
                      >
                        Close payment preview
                      </button>
                    </div>
                  )}
                </>
              )}
              {step === 5 && (
                <>
                  <div className="demo-success">
                    <CheckCircle2 size={45} strokeWidth={1.3} />
                    <p className="eyebrow">DEMO BOOKING CONFIRMED</p>
                    <h3>We’ve made time for you.</h3>
                    <p>
                      Your consultation walkthrough is complete. No real
                      appointment or payment exists.
                    </p>
                  </div>
                  <div className="demo-review">
                    <div>
                      <span>Demo reference</span>
                      <strong>DEMO-KMV-2048</strong>
                    </div>
                    <div>
                      <span>Scheduled for</span>
                      <strong>
                        {dateLabel(date)} · {time} WAT
                      </strong>
                    </div>
                    <div>
                      <span>Payment</span>
                      <strong>Simulated paid · {naira(amount)}</strong>
                    </div>
                  </div>
                  <div className="demo-instructions">
                    <h3>
                      Your{" "}
                      {serviceId === "video"
                        ? "video"
                        : serviceId === "chat"
                          ? "WhatsApp"
                          : "telephone"}{" "}
                      consultation
                    </h3>
                    <p>{instructions}</p>
                    <span className="demo-badge">
                      {serviceId === "video"
                        ? "Meet link preview only — no meeting created"
                        : serviceId === "chat"
                          ? "Chat preview only — no message sent"
                          : "Call instructions only — no call placed"}
                    </span>
                  </div>
                  <div className="demo-actions">
                    <button className="text-link" onClick={restart}>
                      Start another demo
                    </button>
                    <button
                      className="button"
                      onClick={() => setView("patient")}
                    >
                      View demo dashboard <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}
              {message && (
                <p role="alert" className="error">
                  {message}
                </p>
              )}
            </section>
            <aside className="demo-sidebar">
              <div className="demo-summary">
                <p className="eyebrow">YOUR CONSULTATION</p>
                <h3>{service.name}</h3>
                <p>{service.delivery}</p>
                <div>
                  <CalendarDays size={17} />
                  {dateLabel(date)}
                </div>
                <div>
                  <Clock3 size={17} />
                  {time} WAT · 30 min
                </div>
                <hr />
                <p className="demo-price">
                  <strong>{naira(amount)}</strong>
                  <del>{naira(service.regular)}</del>
                </p>
                <span className="demo-badge">50% introductory offer</span>
                <p className="demo-muted">
                  Illustrative schedule and pricing. No slot is held.
                </p>
              </div>
              <div className="demo-assurance">
                <ShieldCheck size={23} />
                <h3>A private space for your health.</h3>
                <p>
                  In this demo, information stays in memory and clears when you
                  reload. Use fictional details only.
                </p>
              </div>
              <p className="demo-emergency">
                Scheduled care is not for medical emergencies. Seek urgent local
                care if needed.
              </p>
            </aside>
          </div>
        </>
      ) : (
        <section className="demo-panel demo-dashboard">
          <div className="demo-dashboard-top">
            <div>
              <p className="eyebrow">
                FICTIONAL {view === "patient" ? "PATIENT" : "DOCTOR"} WORKSPACE
              </p>
              <h2>
                {view === "patient"
                  ? `Welcome, ${profile.fullName.split(" ")[0]}.`
                  : "Your appointment overview."}
              </h2>
            </div>
            <div className="demo-tabs">
              <button
                aria-pressed={view === "patient"}
                onClick={() => setView("patient")}
              >
                Patient view
              </button>
              <button
                aria-pressed={view === "doctor"}
                onClick={() => setView("doctor")}
              >
                Doctor view
              </button>
            </div>
          </div>
          <div className="demo-appointment">
            <div>
              <span className="demo-badge">{status} · demo</span>
              <h3>{service.name}</h3>
              <p>
                {dateLabel(date)} · {time} WAT · 30 minutes
              </p>
              <p>{profile.fullName} · DEMO-KMV-2048</p>
            </div>
            <strong>
              {naira(amount)}
              <small>Simulated payment</small>
            </strong>
          </div>
          <div className="demo-instructions">
            <h3>
              {view === "patient"
                ? "Preparing for your consultation"
                : "Consultation handoff"}
            </h3>
            <p>{instructions}</p>
          </div>
          {view === "doctor" && (
            <>
              <h3>Sample patient intake</h3>
              <dl className="demo-doctor-intake">
                {Object.entries(getValues()).map(([key, value]) => (
                  <div key={key}>
                    <dt>{key.replace(/([A-Z])/g, " $1")}</dt>
                    <dd>
                      {typeof value === "object"
                        ? `${value.response}${value.details ? ": " + value.details : ""}`
                        : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="demo-muted">
                Fictional clinical workspace. No diagnosis, prescription or
                clinical note is created.
              </p>
              <div className="demo-actions">
                <button
                  className="text-link"
                  disabled={status !== "Confirmed"}
                  onClick={() => {
                    setStatus("No-show");
                    setMessage("Demo appointment marked as no-show.");
                  }}
                >
                  Mark no-show
                </button>
                <button
                  className="button"
                  disabled={status !== "Confirmed"}
                  onClick={() => {
                    setStatus("Completed");
                    setMessage("Demo consultation marked as completed.");
                  }}
                >
                  Mark completed <Check size={16} />
                </button>
              </div>
            </>
          )}
          {view === "patient" && status === "Confirmed" && (
            <>
              {reschedule ? (
                <div className="demo-reschedule">
                  {schedule()}
                  <div className="demo-actions">
                    <button
                      className="button"
                      onClick={() => {
                        setReschedule(false);
                        setMessage(
                          "Demo appointment rescheduled. No email sent.",
                        );
                      }}
                    >
                      Save demo schedule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="demo-actions">
                  <button
                    className="text-link"
                    onClick={() => setReschedule(true)}
                  >
                    Reschedule demo
                  </button>
                  <button
                    className="text-link"
                    onClick={() => {
                      setStatus("Cancelled");
                      setMessage(
                        "Demo appointment cancelled. No real refund is initiated.",
                      );
                    }}
                  >
                    Cancel demo appointment
                  </button>
                </div>
              )}
            </>
          )}
          {message && (
            <p role="status" className="demo-feedback">
              {message}
            </p>
          )}
          <button className="text-link" onClick={restart}>
            <RotateCcw size={14} />
            Restart presentation
          </button>
        </section>
      )}
    </main>
  );
}
