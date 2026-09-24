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
          background: "#f5b942",
          borderRadius: 14,
          color: "#17120a",
          fontSize: 42,
          fontWeight: 800,
        }}
      >
        W
      </div>
    ),
    size,
  );
}
