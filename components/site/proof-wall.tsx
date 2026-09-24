"use client";

import { Expand, MessageCircle, Star } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import * as React from "react";
import { track } from "@/lib/analytics";
import { dms, reviews, reviewSummary, type Screenshot } from "@/lib/content";
import { cn } from "@/lib/utils";

const ProofLightbox = dynamic(() => import("./proof-lightbox").then((m) => m.ProofLightbox));

type TabId = "reviews" | "dms";
const TABS: { id: TabId; label: string; items: Screenshot[] }[] = [
  { id: "reviews", label: "Client reviews", items: reviews },
  { id: "dms", label: "DM conversations", items: dms },
];

/** Items visible on phones before "Show all", so the page doesn't become a wall of scrolling. */
const MOBILE_PREVIEW = 3;

export function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5 text-star", className)} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-4 fill-current" />
      ))}
    </span>
  );
}

export function ProofWall() {
  const [tab, setTab] = React.useState<TabId>("reviews");
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState<number | null>(null);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const current = TABS.find((t) => t.id === tab)!;

  function onTabKey(e: React.KeyboardEvent, i: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    setExpanded(false);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-5">
        <div role="tablist" aria-label="Proof" className="inline-flex rounded-full border border-border bg-surface p-1 shadow-sm">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`proof-tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`proof-panel-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              onKeyDown={(e) => onTabKey(e, i)}
              onClick={() => {
                setTab(t.id);
                setExpanded(false);
              }}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-150 sm:px-5",
                tab === t.id ? "bg-primary text-primary-fg shadow-sm" : "text-muted hover:text-text",
              )}
            >
              {t.id === "reviews" ? <Star className="size-4" aria-hidden /> : <MessageCircle className="size-4" aria-hidden />}
              {t.label}
              <span className={cn("rounded-full px-1.5 text-xs tabular-nums", tab === t.id ? "bg-black/15" : "bg-surface-2")}>{t.items.length}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`proof-panel-${tab}`}
        aria-labelledby={`proof-tab-${tab}`}
        className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3"
      >
        {current.items.map((s, i) => (
          <figure
            key={s.src}
            className={cn("mb-4 break-inside-avoid", !expanded && i >= MOBILE_PREVIEW && "hidden sm:block")}
          >
            <button
              type="button"
              onClick={() => {
                setOpen(i);
                track("cta_click", { location: `proof_${tab}`, target: s.title });
              }}
              className="group relative block w-full overflow-hidden rounded-xl border border-border bg-white text-left shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[rgb(var(--glow)/0.6)] hover:shadow-lg"
              aria-label={`Open full size: ${s.title}`}
            >
              <Image
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full"
              />
              <span
                aria-hidden
                className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <Expand className="size-4" />
              </span>
            </button>
            <figcaption className="mt-2 flex items-center justify-between gap-3 px-1 text-sm">
              <span className="truncate text-muted">{s.title}</span>
              {tab === "reviews" && (
                <span className="flex shrink-0 items-center gap-1 font-semibold tabular-nums">
                  <Star className="size-3.5 fill-current text-star" aria-hidden /> 5.0
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {!expanded && current.items.length > MOBILE_PREVIEW && (
        <div className="mt-2 text-center sm:hidden">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="h-11 rounded-full border border-border-strong bg-surface px-6 text-sm font-semibold"
          >
            Show all {current.items.length} {tab === "reviews" ? "reviews" : "conversations"}
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted">
        {tab === "reviews"
          ? `Real screenshots of ${reviewSummary.count} client reviews. Client names blacked out for privacy.`
          : "Real screenshots of Instagram DMs. Names blacked out for privacy."}
      </p>

      {open !== null && (
        <ProofLightbox items={current.items} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}
