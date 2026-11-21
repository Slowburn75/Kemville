export type Status =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RECONCILIATION";
const transitions: Record<Status, Status[]> = {
  PENDING: ["CONFIRMED", "CANCELLED", "RECONCILIATION"],
  CONFIRMED: ["COMPLETED", "CANCELLED", "NO_SHOW"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
  RECONCILIATION: ["CANCELLED"],
};
export function assertTransition(from: Status, to: Status) {
  if (!transitions[from].includes(to))
    throw new Error("Invalid appointment transition");
}
export function paymentDisposition(input: {
  expiresAt: Date;
  now: Date;
  expected: number;
  received: number;
  currency: string;
  alreadyProcessed: boolean;
}) {
  if (input.alreadyProcessed) return "DUPLICATE";
  if (input.expected !== input.received || input.currency !== "NGN")
    return "EXCEPTION";
  return input.expiresAt <= input.now ? "RECONCILIATION" : "CONFIRM";
}
export function assertBookable(
  service: { enabled: boolean; code: string },
  clinicReady: boolean,
) {
  if (!service.enabled || (service.code === "physical" && !clinicReady))
    throw new Error("Consultation is unavailable");
}
