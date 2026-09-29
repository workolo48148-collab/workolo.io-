import Link from "next/link";
import { site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border pb-28 pt-14 md:pb-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
        <p className="max-w-md text-sm leading-relaxed text-muted">{site.disclaimer}</p>
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
      <p className="label-mono mx-auto mt-10 max-w-7xl px-4 text-muted sm:px-6">© {new Date().getFullYear()} Workolo · All rights reserved</p>
    </footer>
  );
}
