import "server-only";

/**
 * Best-effort fixed-window limiter, per server instance. Stops casual abuse of
 * the booking endpoint; put Vercel WAF / Upstash in front for real protection.
 */
const g = globalThis as unknown as { __workoloRate?: Map<string, { count: number; reset: number }> };
const hits = (g.__workoloRate ??= new Map());

export function rateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    return false;
  }
  entry.count++;
  return entry.count > limit;
}
