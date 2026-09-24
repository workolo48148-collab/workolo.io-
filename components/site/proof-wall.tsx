"use client";

import { Expand, MessageCircle, Star } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import * as React from "react";
import { track } from "@/lib/analytics";
import { dms, reviews, type Screenshot } from "@/lib/content";
import { cn } from "@/lib/utils";

const ProofLightbox = dynamic(() => import("./proof-lightbox").then((m) => m.ProofLightbox));

type Item = Screenshot & { kind: "review" | "dm" };

/** Every screenshot, always visible: reviews first, then DMs. */
const ITEMS: Item[] = [...reviews.map((s) => ({ ...s, kind: "review" as const })), ...dms.map((s) => ({ ...s, kind: "dm" as const }))];

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
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <div>
      <p className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1">
          <Star className="size-3.5 fill-current text-star" aria-hidden /> {reviews.length} client reviews
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1">
          <MessageCircle className="size-3.5 text-accent" aria-hidden /> {dms.length} DM conversations
        </span>
      </p>

      <ul className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3" aria-label={`${ITEMS.length} screenshots`}>
        {ITEMS.map((s, i) => (
          <li key={s.src} className="mb-4 break-inside-avoid">
            <figure>
              <button
                type="button"
                onClick={() => {
                  setOpen(i);
                  track("cta_click", { location: `proof_${s.kind}`, target: s.title });
                }}
                className="group relative block w-full overflow-hidden rounded-xl border border-border bg-white text-left shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[rgb(var(--glow)/0.6)] hover:shadow-lg"
                aria-label={`Open full size: ${s.kind === "review" ? "client review" : "DM"}, ${s.title}`}
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
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                      s.kind === "review" ? "bg-[rgb(var(--glow)/0.14)] text-accent" : "bg-surface-2 text-muted",
                    )}
                  >
                    {s.kind === "review" ? "Client review" : "DM"}
                  </span>
                  <span className="truncate text-muted">{s.title}</span>
                </span>
                {s.kind === "review" && (
                  <span className="flex shrink-0 items-center gap-1 font-semibold tabular-nums">
                    <Star className="size-3.5 fill-current text-star" aria-hidden /> 5.0
                  </span>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center text-xs text-muted">Real screenshots. Names blacked out for privacy. Tap any one to read it full size.</p>

      {open !== null && <ProofLightbox items={ITEMS} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}
