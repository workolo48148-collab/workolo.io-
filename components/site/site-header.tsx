import { ctaLabel } from "@/lib/content";
import { CtaLink } from "./cta-link";
import { Logo } from "./logo";

/** Top bar: WRKL logo left, booking CTA right. Sits above the hero. */
export function SiteHeader() {
  return (
    <header className="relative z-30 border-b border-border/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="#hero" aria-label="Workolo home" className="rounded-md focus-visible:outline-2 focus-visible:outline-ring">
          <Logo className="h-9 sm:h-10" />
        </a>
        <CtaLink location="header" size="sm" className="hidden sm:inline-flex">
          {ctaLabel}
        </CtaLink>
      </div>
    </header>
  );
}
