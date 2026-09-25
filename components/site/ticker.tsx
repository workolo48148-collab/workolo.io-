import { ticker } from "@/lib/content";

/**
 * Market-style ticker tape. Pure CSS (one transform animation), duplicated once
 * for a seamless loop; pauses on hover and stops under reduced motion.
 */
export function Ticker() {
  const items = [...ticker, ...ticker];
  return (
    <div className="ticker tone-flip relative overflow-hidden border-y border-border py-3.5" role="marquee" aria-label="Workolo at a glance">
      <ul className="ticker-track flex w-max items-center gap-10 pr-10">
        {items.map((t, i) => (
          <li key={i} aria-hidden={i >= ticker.length || undefined} className="label-mono flex shrink-0 items-center gap-10 text-[0.78rem] text-text">
            <span>{t}</span>
            <span aria-hidden className="text-accent">
              ▲
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
