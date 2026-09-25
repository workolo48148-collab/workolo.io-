import { CtaLink } from "./cta-link";
import { Logo } from "./logo";

/** Minimal by design: logo, one availability cue, one action. No nav links to leak paid traffic. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" aria-label="Workolo, back to top" className="rounded-md">
          <Logo />
        </a>
        <div className="flex items-center gap-5">
          <p className="label-mono hidden items-center gap-2 text-muted md:flex">
            <span className="live-dot size-1.5 rounded-full bg-[rgb(var(--glow))]" aria-hidden />
            Taking calls Mon–Sat
          </p>
          <CtaLink location="header" size="sm">
            Book a call
          </CtaLink>
        </div>
      </div>
    </header>
  );
}
