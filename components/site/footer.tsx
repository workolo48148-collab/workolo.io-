import Link from "next/link";
import { site } from "@/lib/content";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-border pb-28 pt-14 md:pb-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">{site.disclaimer}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
          <a href={`mailto:${site.email}`} className="text-muted hover:text-text">
            {site.email}
          </a>
          {site.socials.map((s) => (
            <a key={s.href} href={s.href} className="text-muted hover:text-text" target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
          <Link href="/privacy" className="text-muted hover:text-text">
            Privacy
          </Link>
          <Link href="/terms" className="text-muted hover:text-text">
            Terms
          </Link>
        </nav>
      </div>

      {/* Oversized editorial wordmark, decorative */}
      <p
        aria-hidden
        className="mx-auto mt-14 max-w-7xl select-none px-4 font-display text-[clamp(4.5rem,19vw,17rem)] italic leading-[0.8] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_var(--border-strong)] sm:px-6"
      >
        Workolo
      </p>
      <p className="label-mono mx-auto mt-8 max-w-7xl px-4 text-muted sm:px-6">© {new Date().getFullYear()} Workolo · All rights reserved</p>
    </footer>
  );
}
