import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "#0A0A0A",
          borderRadius: 14,
          color: "#FFFFFF",
          fontSize: 42,
          fontWeight: 800,
        }}
      >
        W
        <div style={{ position: "absolute", right: 9, bottom: 9, width: 9, height: 9, borderRadius: 999, background: "#2563EB" }} />
      </div>
    ),
    size,
  );
}
