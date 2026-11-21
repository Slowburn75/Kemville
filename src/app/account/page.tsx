"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
type Form = Record<string, string | boolean>;
export default function Account() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>();
  async function submit(values: Form) {
    setMessage("");
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      setMessage(data.message ?? data.error);
      if (response.ok && mode === "login") router.push("/dashboard");
    } catch {
      setMessage("Connection failed. Please try again.");
    }
  }
  const field = (
    name: string,
    label: string,
    type = "text",
    required = true,
  ) => (
    <label key={name}>
      {label}
      <input
        type={type}
        {...register(name, { required })}
        autoComplete={
          name === "password"
            ? mode === "register"
              ? "new-password"
              : "current-password"
            : name === "email"
              ? "email"
              : "off"
        }
      />
    </label>
  );
  return (
    <main id="main" className="prose-page">
      <p className="eyebrow">YOUR KEMVILLE ACCOUNT</p>
      <h1>{mode === "register" ? "A little about you." : "Welcome back."}</h1>
      <div className="progress-steps">
        {["login", "register", "verify", "forgot", "reset"].map((m) => (
          <button
            type="button"
            className="text-link"
            key={m}
            onClick={() => {
              setMode(m);
              setStep(1);
              setMessage("");
            }}
          >
            {m === "forgot" ? "Forgot password" : m}
          </button>
        ))}
      </div>
      <form
        onSubmit={handleSubmit(submit)}
        style={{ maxWidth: 480, marginTop: 30 }}
      >
        {mode === "register" ? (
          <>
            <p>Step {step} of 3 · Adults only</p>
            <div hidden={step !== 1}>
              {field("fullName", "Full name")}
              {field("email", "Email", "email")}
              {field("password", "Password (12+ characters)", "password")}
              {field("confirmPassword", "Confirm password", "password")}
            </div>
            <div hidden={step !== 2}>
              {field("birthDate", "Date of birth", "date")}
              <label>
                Sex
                <select {...register("sex")}>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </label>
              {field("phone", "Phone with country code", "tel")}
              {field("country", "Country of residence")}
              {field("state", "State of residence")}
              <label>
                Blood group
                <select {...register("bloodGroup")}>
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
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                Genotype
                <select {...register("genotype")}>
                  {["Unknown", "AA", "AS", "AC", "SS", "SC", "CC"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
            </div>
            <div hidden={step !== 3}>
              <p>
                Health profile information is sensitive. Read our{" "}
                <Link className="text-link" href="/privacy">
                  draft privacy notice
                </Link>
                . Registration should remain disabled until policies are
                approved.
              </p>
              <label>
                <input
                  style={{ display: "inline", width: "auto", marginRight: 10 }}
                  type="checkbox"
                  {...register("consent", { required: true })}
                />
                I have read the privacy information and consent to necessary
                health data processing.
              </label>
            </div>
            <div style={{ display: "flex", gap: 15, marginTop: 20 }}>
              {step > 1 && (
                <button
                  type="button"
                  className="button"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </button>
              )}
              {step < 3 && (
                <button
                  type="button"
                  className="button"
                  onClick={() => setStep(step + 1)}
                >
                  Continue
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {["login", "forgot"].includes(mode) &&
              field("email", "Email", "email")}
            {mode === "login" && field("password", "Password", "password")}
            {["verify", "reset"].includes(mode) &&
              field("token", "One-time code")}
            {mode === "reset" &&
              field("password", "New password (12+ characters)", "password")}
          </>
        )}
        {(mode !== "register" || step === 3) && (
          <button
            disabled={isSubmitting}
            className="button"
            style={{ marginTop: 20 }}
          >
            {isSubmitting
              ? "Please wait…"
              : mode === "register"
                ? "Create account"
                : mode === "login"
                  ? "Sign in"
                  : "Continue"}
          </button>
        )}
        <p role="status" style={{ marginTop: 20 }}>
          {message}
        </p>
      </form>
    </main>
  );
}
