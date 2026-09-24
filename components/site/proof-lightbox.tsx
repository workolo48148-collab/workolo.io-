"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import type { Screenshot } from "@/lib/content";

/** Full-size screenshot viewer: focus-trapped, Esc closes, ←/→ step through. */
export function ProofLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: Screenshot[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const item = items[index];
  const go = (delta: number) => onIndexChange((index + delta + items.length) % items.length);

  return (
    <DialogPrimitive.Root open onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 data-[state=open]:animate-[fade-in_200ms_var(--ease-out)]" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 outline-none sm:p-10"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
        >
          <DialogPrimitive.Title className="sr-only">{item.title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">{item.alt}</DialogPrimitive.Description>

          <div className="flex w-full max-w-4xl items-center justify-between pb-3 text-sm text-white/80">
            <span className="tabular-nums" aria-live="polite">
              {index + 1} / {items.length} · {item.title}
            </span>
            <DialogPrimitive.Close className="grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close">
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>

          <div className="relative flex min-h-0 w-full max-w-4xl flex-1 items-center justify-center">
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(min-width: 1024px) 896px, 100vw"
              className="max-h-full w-auto animate-fade-up rounded-xl bg-white object-contain shadow-2xl"
            />
          </div>

          {items.length > 1 && (
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => go(-1)} className="grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Previous screenshot">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => go(1)} className="grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Next screenshot">
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
