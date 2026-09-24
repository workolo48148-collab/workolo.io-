import { readEnv } from "../../env";
import { BookingError } from "../errors";

export function requireEnv(name: string): string {
  const v = readEnv(process.env[name]);
  if (!v) throw new Error(`Missing environment variable ${name} for the selected BOOKING_ADAPTER`);
  return v;
}

/** fetch with a timeout; network failures and 5xx become UPSTREAM_ERROR. */
export async function upstream(url: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<Response> {
  const { timeoutMs = 10_000, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(url, { ...rest, signal: AbortSignal.timeout(timeoutMs), cache: "no-store" });
  } catch (err) {
    console.error("[booking] upstream request failed", url, err);
    throw new BookingError("UPSTREAM_ERROR", "Our calendar provider didn't respond. Please try again in a moment.");
  }
  if (res.status >= 500) {
    console.error("[booking] upstream 5xx", url, res.status, await res.text().catch(() => ""));
    throw new BookingError("UPSTREAM_ERROR", "Our calendar provider had a problem. Please try again in a moment.");
  }
  return res;
}

export function answersSummary(input: {
  instagram: string;
  note: string;
  timeline?: string;
  outcome: string;
  budget: string;
  phone?: string;
  smsConsent?: boolean;
}): string {
  return [
    `Instagram / socials: ${input.instagram}`,
    `What they teach or trade: ${input.note}`,
    `Timeline: ${input.timeline || "—"}`,
    `90-day outcome: ${input.outcome}`,
    `Monthly budget: ${input.budget}`,
    `Phone: ${input.phone || "—"}`,
    `SMS consent: ${input.smsConsent ? "yes" : "no"}`,
  ].join("\n");
}
