"use client";
import Link from "next/link";
import {
  CalendarDays,
  Settings2,
  ClipboardList,
  RotateCcw,
  ShieldCheck,
  Bell,
} from "lucide-react";
export function DemoWorkspace({
  role,
  children,
  onReset,
}: {
  role: "doctor" | "admin";
  children: React.ReactNode;
  onReset: () => void;
}) {
  return (
    <main id="main" className="workspace-page">
      <div className="demo-banner">
        <div>
          <ShieldCheck size={18} />
          <span>
            <strong>
              {role === "doctor" ? "Doctor" : "Admin"} presentation demo
            </strong>{" "}
            · Fictional records. Changes stay in this tab; no real actions or
            messages.
          </span>
        </div>
        <button onClick={onReset}>
          <RotateCcw size={14} />
          Reset demo
        </button>
      </div>
      <div className="workspace-role-links">
        <Link href="/demo/consultation">Patient booking</Link>
        <Link
          href="/demo/doctor"
          aria-current={role === "doctor" ? "page" : undefined}
        >
          Doctor workspace
        </Link>
        <Link
          href="/demo/admin"
          aria-current={role === "admin" ? "page" : undefined}
        >
          Admin workspace
        </Link>
      </div>
      {children}
    </main>
  );
}
export function WorkspaceNav({
  items,
  active,
  onChange,
}: {
  items: string[];
  active: string;
  onChange: (s: string) => void;
}) {
  const icons = [CalendarDays, ClipboardList, Settings2, Bell];
  return (
    <nav className="workspace-nav" aria-label="Workspace sections">
      <p className="eyebrow">WORKSPACE</p>
      {items.map((item, i) => {
        const Icon = icons[i % icons.length];
        return (
          <button
            key={item}
            aria-pressed={active === item}
            onClick={() => onChange(item)}
          >
            <Icon size={17} />
            {item}
          </button>
        );
      })}
      <div className="workspace-nav-note">
        <ShieldCheck size={22} />
        <p>
          Presentation environment
          <br />
          No production records
        </p>
      </div>
    </nav>
  );
}
export function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="workspace-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}
