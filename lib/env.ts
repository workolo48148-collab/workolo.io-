/**
 * Every environment variable is read through here, so a blank value, stray
 * whitespace, or a pasted "# comment" can never break the build (an empty
 * NEXT_PUBLIC_SITE_URL once crashed `new URL()` during `next build`).
 * Invalid values fall back to safe defaults instead of throwing.
 */

/** Trimmed value, or undefined if unset, blank, or only a comment. */
export function readEnv(value: string | undefined): string | undefined {
  const v = value?.replace(/\s+#.*$/, "").trim().replace(/^["']|["']$/g, "");
  return v ? v : undefined;
}

function toSiteUrl(raw: string | undefined): string | undefined {
  const v = readEnv(raw);
  if (!v) return undefined;
  try {
    const url = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    return url.origin;
  } catch {
    return undefined;
  }
}

/**
 * Canonical site origin, no trailing slash. Order: NEXT_PUBLIC_SITE_URL →
 * Vercel's production domain → https://workolo.io.
 */
export const SITE_URL =
  toSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? toSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ?? "https://workolo.io";

/** GA4 measurement id (G-XXXXXXX); anything else is ignored. */
export const GA4_ID = matchOrUndefined(process.env.NEXT_PUBLIC_GA4_ID, /^G-[A-Z0-9]{4,20}$/i);

/** Meta Pixel id (digits only); anything else is ignored. */
export const META_PIXEL_ID = matchOrUndefined(process.env.NEXT_PUBLIC_META_PIXEL_ID, /^\d{6,20}$/);

function matchOrUndefined(raw: string | undefined, pattern: RegExp) {
  const v = readEnv(raw);
  return v && pattern.test(v) ? v : undefined;
}

export function envNumber(raw: string | undefined, fallback: number, min: number, max: number): number {
  const n = Number(readEnv(raw));
  return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
}
