import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Workolo: Land retainer clients as a busy finance guru";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "radial-gradient(80% 90% at 20% 0%, #0b3a2a 0%, #060807 60%)",
          color: "#f1f5f2",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 700 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", color: "#022c1d", fontSize: 32 }}>
              W
            </div>
            Workolo
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, maxWidth: 700 }}>Land retainer clients as a busy finance guru.</div>
            <div style={{ fontSize: 28, color: "#97a39d", maxWidth: 680 }}>Done-for-you Instagram content system. You film 1–2 days a month.</div>
          </div>
          <div style={{ display: "flex", alignSelf: "flex-start", background: "#34d399", color: "#022c1d", fontSize: 26, fontWeight: 700, padding: "14px 28px", borderRadius: 999 }}>
            Book a 30-min discovery call →
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
        <img src={src} alt="" width={360} height={360} style={{ borderRadius: 24, alignSelf: "center", objectFit: "cover", border: "2px solid #2b3632" }} />
      </div>
    ),
    size,
  );
}
