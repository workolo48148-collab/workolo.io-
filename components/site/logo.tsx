import { cn } from "@/lib/utils";

/**
 * WRKL logomark — the stacked monogram: angular "W" and "R" on top, blocky "K"
 * and "L" below, in a 2×2 grid. Drawn in currentColor so it's white on the dark
 * header and dark on light (legal) pages. Sized by height via `className`
 * (default h-8). Accessible name: "Workolo".
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 104" className={cn("h-8 w-auto", className)} fill="currentColor" role="img" aria-label="Workolo">
      {/* W — angular, two pointed prongs */}
      <path d="M0 0 L51 0 L38 48 L25.5 13 L13 48 Z" />

      {/* R — stem + bowl (with counter) + leg */}
      <rect x="61" y="0" width="14" height="48" />
      <path fillRule="evenodd" d="M75 0 H93 C101 0 101 26 93 26 H75 Z M78 8 H89 C94 8 94 18 89 18 H78 Z" />
      <path d="M74 22 L88 22 L104 48 L90 48 Z" />

      {/* K — stem + arm + leg meeting at the vertex */}
      <rect x="0" y="56" width="14" height="48" />
      <path d="M14 80 L26 80 L51 56 L39 56 Z" />
      <path d="M14 80 L26 80 L51 104 L39 104 Z" />

      {/* L — stem + foot */}
      <rect x="61" y="56" width="15" height="48" />
      <rect x="61" y="90" width="44" height="14" />
    </svg>
  );
}
