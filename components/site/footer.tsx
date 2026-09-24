import Link from "next/link";
import { site } from "@/lib/content";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-border pb-28 pt-10 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <Logo />
          <p className="mt-3 text-sm text-muted">{site.disclaimer}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
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
      <p className="mx-auto mt-8 max-w-6xl px-4 text-xs text-muted sm:px-6">© {new Date().getFullYear()} Workolo. All rights reserved.</p>
    </footer>
  );
}
