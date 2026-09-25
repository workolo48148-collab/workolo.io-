/**
 * Conversion events for paid traffic. Each call fans out to:
 *  - window.dataLayer (GTM)
 *  - GA4 via gtag('event', …)
 *  - Meta Pixel via fbq — trackCustom for every event, plus standard
 *    events Meta can optimise for (Lead on booking_started, Schedule on booking_completed).
 * All targets are optional; missing ones are skipped.
 */

export type AnalyticsEvent = "cta_click" | "booking_started" | "slot_selected" | "booking_completed" | "booking_cancelled";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_STANDARD: Partial<Record<AnalyticsEvent, string>> = {
  booking_started: "Lead",
  booking_completed: "Schedule",
};

const fired = new Set<string>();

export function track(event: AnalyticsEvent, params: Params = {}, opts: { once?: boolean } = {}) {
  if (typeof window === "undefined") return;
  if (opts.once) {
    if (fired.has(event)) return;
    fired.add(event);
  }
  const clean = Object.fromEntries(Object.entries({ ...params, ...getUtm() }).filter(([, v]) => v !== undefined));
  try {
    window.dataLayer?.push({ event, ...clean });
    window.gtag?.("event", event, clean);
    window.fbq?.("trackCustom", event, clean);
    const standard = META_STANDARD[event];
    if (standard) window.fbq?.("track", standard, clean);
  } catch {
    // Analytics must never break booking.
  }
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, clean);
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "ttclid"];
const UTM_STORAGE = "workolo_utm";

/** Captures ad click params on first landing so they survive in-page navigation. */
export function captureUtm() {
  if (typeof window === "undefined") return;
  const qs = new URLSearchParams(window.location.search);
  const found = Object.fromEntries(UTM_KEYS.filter((k) => qs.get(k)).map((k) => [k, qs.get(k)!.slice(0, 200)]));
  if (!Object.keys(found).length) return;
  try {
    sessionStorage.setItem(UTM_STORAGE, JSON.stringify(found));
  } catch {}
}

export function getUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE) || "{}");
  } catch {
    return {};
  }
}
