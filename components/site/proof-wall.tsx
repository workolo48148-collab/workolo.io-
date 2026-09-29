"use client";

import { Expand, Star } from "lucide-react";
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
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3" aria-label={`${ITEMS.length} screenshots`}>
        {ITEMS.map((s, i) => (
          <li key={s.src} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => {
                setOpen(i);
                track("cta_click", { location: `proof_${s.kind}`, target: s.title });
              }}
              className="group relative block w-full overflow-hidden rounded-xl border border-border bg-white text-left shadow-sm hover:border-accent"
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
                className="absolute right-3 top-3 hidden size-8 place-items-center rounded-full bg-black/70 text-white group-hover:grid group-focus-visible:grid"
              >
                <Expand className="size-4" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && <ProofLightbox items={ITEMS} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}
