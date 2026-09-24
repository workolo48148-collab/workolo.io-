import { CtaLink } from "./cta-link";
import { Logo } from "./logo";

/** Minimal by design: logo + one action. No nav links to leak paid traffic. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" aria-label="Workolo, back to top" className="rounded-md">
          <Logo />
        </a>
        <CtaLink location="header" size="sm">
          Book a call
        </CtaLink>
      </div>
    </header>
  );
}
