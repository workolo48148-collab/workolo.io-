import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Workolo: Build your personal brand on social media as a busy finance pro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** WRKL logomark (white), as an SVG data URI so ImageResponse renders the exact vector. */
const WRKL = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 112 104' fill='#fff'><path d='M0 0 L51 0 L38 48 L25.5 13 L13 48 Z'/><rect x='61' y='0' width='14' height='48'/><path fill-rule='evenodd' d='M75 0 H93 C101 0 101 26 93 26 H75 Z M78 8 H89 C94 8 94 18 89 18 H78 Z'/><path d='M74 22 L88 22 L104 48 L90 48 Z'/><rect x='0' y='56' width='14' height='48'/><path d='M14 80 L26 80 L51 56 L39 56 Z'/><path d='M14 80 L26 80 L51 104 L39 104 Z'/><rect x='61' y='56' width='15' height='48'/><rect x='61' y='90' width='44' height='14'/></svg>`;
const wrklSrc = `data:image/svg+xml;utf8,${encodeURIComponent(WRKL)}`;

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/images/salman.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0A0A0A",
          color: "#FFFFFF",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
            <img src={wrklSrc} width={52} height={48} alt="" />
            Workolo
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, maxWidth: 720, textTransform: "uppercase" }}>
              Build your personal brand on social media.
            </div>
            <div style={{ fontSize: 28, color: "#A3A3A3", maxWidth: 680 }}>
              Done-For-You content system for busy financial professionals.
            </div>
          </div>
          <div style={{ display: "flex", alignSelf: "flex-start", background: "#2563EB", color: "#FFFFFF", fontSize: 26, fontWeight: 700, padding: "14px 28px", borderRadius: 999 }}>
            Book a free 30-min discovery call →
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
        <img src={src} alt="" width={360} height={360} style={{ borderRadius: 24, alignSelf: "center", objectFit: "cover", border: "2px solid #262626" }} />
      </div>
    ),
    size,
  );
}
