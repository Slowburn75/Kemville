"use client";
import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Search,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { DemoWorkspace, WorkspaceNav, Metric } from "./demo-workspace";
const fixtures = [
  {
    id: "DEMO-2101",
    name: "Alex Morgan",
    initials: "AM",
    time: "09:00",
    service: "Video",
    status: "Confirmed",
    day: "Today",
  },
  {
    id: "DEMO-2102",
    name: "Taylor Reed",
    initials: "TR",
    time: "10:00",
    service: "WhatsApp",
    status: "Confirmed",
    day: "Today",
  },
  {
    id: "DEMO-2103",
    name: "Jordan Ellis",
    initials: "JE",
    time: "11:30",
    service: "Telephone",
    status: "Confirmed",
    day: "Today",
  },
  {
    id: "DEMO-2104",
    name: "Casey Blake",
    initials: "CB",
    time: "14:00",
    service: "Video",
    status: "Completed",
    day: "Today",
  },
  {
    id: "DEMO-2105",
    name: "Robin Lane",
    initials: "RL",
    time: "09:30",
    service: "Telephone",
    status: "Confirmed",
    day: "Tomorrow",
  },
];
// Fictional registered patient accounts, including people without appointments.
const registeredUsers = [
  {
    id: "DEMO-USER-101",
    name: "Alex Morgan",
    joinedDaysAgo: 30,
    verified: true,
  },
  {
    id: "DEMO-USER-102",
    name: "Taylor Reed",
    joinedDaysAgo: 0,
    verified: true,
  },
  {
    id: "DEMO-USER-103",
    name: "Jordan Ellis",
    joinedDaysAgo: 0,
    verified: true,
  },
  {
    id: "DEMO-USER-104",
    name: "Casey Blake",
    joinedDaysAgo: 8,
    verified: true,
  },
  { id: "DEMO-USER-105", name: "Robin Lane", joinedDaysAgo: 2, verified: true },
  {
    id: "DEMO-USER-106",
    name: "Avery Quinn",
    joinedDaysAgo: 0,
    verified: false,
  },
  { id: "DEMO-USER-107", name: "Sam Parker", joinedDaysAgo: 5, verified: true },
  {
    id: "DEMO-USER-108",
    name: "Jamie Brooks",
    joinedDaysAgo: 14,
    verified: true,
  },
];
const recentRegistrations = [...registeredUsers].sort(
  (a, b) => a.joinedDaysAgo - b.joinedDaysAgo,
);
const intake = [
  ["Full name", "Selected fictional patient"],
  ["Age", "34 (sample)"],
  ["Sex", "Prefer not to say"],
  ["Phone", "+2348000000000 (fictional)"],
  ["Main health concern", "Routine wellbeing discussion — fictional."],
  ["When it started", "Two weeks ago (sample answer)."],
  ["Symptoms", "Occasional tiredness — demonstration only."],
  ["Known medical conditions", "No"],
  ["Medications or supplements", "No"],
  ["Drug allergies", "Unknown"],
  ["Previous surgeries or admissions", "No"],
  ["Consultation goal", "Understand possible next steps with a clinician."],
];
export function DoctorDemo() {
  const [tab, setTab] = useState("Appointments");
  const [appointments, setAppointments] = useState(fixtures);
  const [selected, setSelected] = useState(fixtures[0].id);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [days, setDays] = useState(["Monday", "Tuesday", "Thursday", "Friday"]);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("16:00");
  const [duration, setDuration] = useState("30");
  const [availabilitySaved, setAvailabilitySaved] = useState(false);
  const current = appointments.find((a) => a.id === selected)!;
  const filtered = appointments.filter(
    (a) =>
      (filter === "All" || a.status === filter) &&
      `${a.name} ${a.id}`.toLowerCase().includes(search.toLowerCase()),
  );
  function reset() {
    setTab("Appointments");
    setAppointments(fixtures);
    setSelected(fixtures[0].id);
    setSearch("");
    setFilter("All");
    setNotes({});
    setFeedback("");
    setDays(["Monday", "Tuesday", "Thursday", "Friday"]);
    setStart("09:00");
    setEnd("16:00");
    setDuration("30");
    setAvailabilitySaved(false);
  }
  function status(value: string) {
    setAppointments((all) =>
      all.map((a) => (a.id === selected ? { ...a, status: value } : a)),
    );
    setFeedback(`Demo appointment marked ${value.toLowerCase()}.`);
  }
  return (
    <DemoWorkspace role="doctor" onReset={reset}>
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">THE CLINICAL WORKSPACE</p>
          <h1>
            A little clarity.
            <br />
            <em>More time for care.</em>
          </h1>
          <p>Your sample schedule, patient intake and consultation workflow.</p>
        </div>
        <div className="workspace-person">
          <span>DK</span>
          <div>
            <strong>Demo clinician</strong>
            <small>Fictional account · WAT (UTC+1)</small>
          </div>
        </div>
      </div>
      <section
        className="doctor-registration-overview"
        aria-label="Patient registrations"
      >
        <div className="registration-heading">
          <div>
            <p className="eyebrow">PATIENT GROWTH</p>
            <h2>New faces. A growing community.</h2>
          </div>
          <button
            className="text-link"
            onClick={() => {
              setTab("Registered users");
              setFeedback("");
            }}
          >
            View registered users <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="workspace-metrics">
          <Metric
            label="Total registered users"
            value={registeredUsers.length}
            detail="Fictional patient accounts · includes unverified"
          />
          <Metric
            label="New users today"
            value={registeredUsers.filter((u) => u.joinedDaysAgo === 0).length}
            detail="Joined today in the demo timeline"
          />
          <Metric
            label="New in the last 7 days"
            value={registeredUsers.filter((u) => u.joinedDaysAgo < 7).length}
            detail="Includes today · fictional registrations"
          />
        </div>
      </section>
      <div className="workspace-metrics">
        <Metric
          label="Today’s appointments"
          value={appointments.filter((a) => a.day === "Today").length}
          detail="Fictional sample schedule"
        />
        <Metric
          label="Awaiting consultation"
          value={appointments.filter((a) => a.status === "Confirmed").length}
          detail="Across today and tomorrow"
        />
        <Metric
          label="Completed"
          value={appointments.filter((a) => a.status === "Completed").length}
          detail="Demo outcomes only"
        />
      </div>
      <div className="workspace-layout">
        <WorkspaceNav
          items={[
            "Appointments",
            "Registered users",
            "Weekly schedule",
            "Availability",
          ]}
          active={tab}
          onChange={(t) => {
            setTab(t);
            setFeedback("");
          }}
        />
        <section className="workspace-content">
          <div className="workspace-section-heading">
            <div>
              <p className="eyebrow">DOCTOR / {tab.toUpperCase()}</p>
              <h2>
                {tab === "Appointments"
                  ? "Every conversation matters."
                  : tab === "Registered users"
                    ? "Welcome the newest patients."
                    : tab === "Weekly schedule"
                      ? "Your week, at a glance."
                      : "Make room for good care."}
              </h2>
            </div>
            <span className="demo-badge">FICTIONAL DATA</span>
          </div>
          {tab === "Registered users" && (
            <>
              <p className="demo-muted">
                All {registeredUsers.length} sample accounts, newest first.
                Registration does not grant access to a patient’s clinical
                records.
              </p>
              <div className="registration-list">
                {recentRegistrations.map((user) => (
                  <article key={user.id}>
                    <div>
                      <h3>{user.name}</h3>
                      <p>
                        {user.id} ·{" "}
                        {user.verified
                          ? "Demo email verified"
                          : "Demo verification pending"}
                      </p>
                    </div>
                    <div>
                      <strong>
                        {user.joinedDaysAgo === 0
                          ? "Joined today"
                          : `${user.joinedDaysAgo} days ago`}
                      </strong>
                      {user.joinedDaysAgo === 0 && (
                        <span className="demo-badge">NEW TODAY</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              <p className="demo-muted">
                Illustrative registration timeline, not live analytics. No
                contact or medical information is shown here.
              </p>
            </>
          )}
          {tab === "Appointments" && (
            <>
              <div className="workspace-toolbar">
                <label>
                  <Search size={16} />
                  <input
                    aria-label="Search appointments"
                    placeholder="Search patient or reference"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <select
                  aria-label="Appointment status filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {[
                    "All",
                    "Confirmed",
                    "Completed",
                    "No-show",
                    "Cancelled",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="doctor-columns">
                <div className="appointment-list">
                  {filtered.length ? (
                    filtered.map((a) => (
                      <button
                        key={a.id}
                        aria-pressed={selected === a.id}
                        onClick={() => {
                          setSelected(a.id);
                          setFeedback("");
                        }}
                      >
                        <div className="appointment-list-top">
                          <span>
                            {a.time} <small>{a.day}</small>
                          </span>
                          <span className="demo-badge">{a.status}</span>
                        </div>
                        <h3>{a.name}</h3>
                        <p>{a.service} · 30 min</p>
                        <small>{a.id}</small>
                      </button>
                    ))
                  ) : (
                    <p className="workspace-empty">
                      No matching appointments. Try another search or status.
                    </p>
                  )}
                </div>
                <article className="patient-detail">
                  <div className="patient-detail-head">
                    <span className="patient-avatar">{current.initials}</span>
                    <div>
                      <h3>{current.name}</h3>
                      <p>Fictional patient · {current.id}</p>
                    </div>
                  </div>
                  <div className="patient-detail-schedule">
                    <span>
                      <CalendarDays size={15} />
                      {current.day}
                    </span>
                    <span>
                      <Clock3 size={15} />
                      {current.time} WAT
                    </span>
                    <span className="demo-badge">{current.status}</span>
                  </div>
                  <div className="workspace-handoff">
                    <h4>{current.service} consultation</h4>
                    <p>
                      {current.service === "Video"
                        ? "A Google Meet link would appear here after live meeting creation."
                        : current.service === "WhatsApp"
                          ? "The official practice chat would open with a booking reference only."
                          : "The doctor initiates the call and verifies the patient’s identity."}
                    </p>
                    <button
                      className="text-link"
                      onClick={() =>
                        setFeedback(
                          `${current.service} handoff preview — no meeting, chat or call started.`,
                        )
                      }
                    >
                      Preview {current.service.toLowerCase()} handoff{" "}
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                  <details className="workspace-intake">
                    <summary>Review sample intake · 12 answers</summary>
                    <dl>
                      {intake.map(([label, value], i) => (
                        <div key={label}>
                          <dt>
                            {String(i + 1).padStart(2, "0")} · {label}
                          </dt>
                          <dd>{i === 0 ? current.name : value}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                  <label className="workspace-note-label">
                    Private note draft · demo only
                    <textarea
                      rows={3}
                      maxLength={2000}
                      placeholder="Fictional notes only. Do not enter real patient information."
                      value={notes[selected] ?? ""}
                      onChange={(e) =>
                        setNotes({ ...notes, [selected]: e.target.value })
                      }
                    />
                  </label>
                  <button
                    className="text-link"
                    onClick={() =>
                      setFeedback(
                        "Demo note retained in this tab only. No medical record was saved.",
                      )
                    }
                  >
                    Save demo note
                  </button>
                  <div className="workspace-outcomes">
                    <button
                      className="button"
                      disabled={current.status !== "Confirmed"}
                      onClick={() => status("Completed")}
                    >
                      <Check size={16} />
                      Mark completed
                    </button>
                    <button
                      className="text-link"
                      disabled={current.status !== "Confirmed"}
                      onClick={() => status("No-show")}
                    >
                      Mark no-show
                    </button>
                  </div>
                </article>
              </div>
            </>
          )}
          {tab === "Weekly schedule" && (
            <>
              <p className="demo-muted">
                Illustrative week. No live calendar is connected.
              </p>
              <div className="workspace-week">
                {["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"].map(
                  (day, i) => (
                    <div key={day}>
                      <h3>{day}</h3>
                      {appointments
                        .filter((a) => a.day === day)
                        .map((a) => (
                          <button
                            key={a.id}
                            onClick={() => {
                              setSelected(a.id);
                              setTab("Appointments");
                            }}
                          >
                            <strong>{a.time}</strong>
                            <span>{a.name}</span>
                            <small>
                              {a.service} · {a.status}
                            </small>
                          </button>
                        ))}
                      {i > 1 && <p>No sample appointments</p>}
                    </div>
                  ),
                )}
              </div>
            </>
          )}
          {tab === "Availability" && (
            <form
              className="availability-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (start >= end) {
                  setFeedback("End time must be later than start time.");
                  return;
                }
                setAvailabilitySaved(true);
                setFeedback(
                  "Demo working hours updated. No live slots changed.",
                );
              }}
            >
              <p>
                Choose a sample working pattern. Changes demonstrate the
                workflow and do not affect real booking availability.
              </p>
              <fieldset>
                <legend>Working days</legend>
                <div className="workspace-days">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <label key={day}>
                      <input
                        type="checkbox"
                        checked={days.includes(day)}
                        onChange={() => {
                          setDays(
                            days.includes(day)
                              ? days.filter((d) => d !== day)
                              : [...days, day],
                          );
                          setAvailabilitySaved(false);
                        }}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="demo-form-grid">
                <label>
                  Start time
                  <input
                    required
                    type="time"
                    value={start}
                    onChange={(e) => {
                      setStart(e.target.value);
                      setAvailabilitySaved(false);
                    }}
                  />
                </label>
                <label>
                  End time
                  <input
                    required
                    type="time"
                    value={end}
                    onChange={(e) => {
                      setEnd(e.target.value);
                      setAvailabilitySaved(false);
                    }}
                  />
                </label>
                <label>
                  Consultation duration
                  <select
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value);
                      setAvailabilitySaved(false);
                    }}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                  </select>
                </label>
                <label>
                  Timezone
                  <input value="Africa/Lagos (UTC+1)" readOnly />
                </label>
              </div>
              <div className="notice">
                <strong>
                  {days.length} working days · {duration}-minute consultations
                </strong>
                <p>
                  {start}–{end} WAT · 10-minute buffer · 24-hour minimum notice
                </p>
              </div>
              <button className="button">
                {availabilitySaved
                  ? "Demo schedule saved"
                  : "Save demo availability"}
              </button>
            </form>
          )}
          {feedback && (
            <p role="status" className="demo-feedback">
              {feedback}
            </p>
          )}
        </section>
      </div>
    </DemoWorkspace>
  );
}
