import { ImageResponse } from "next/og";

// 96×96 (a multiple of 48) so Google accepts and shows the favicon in search results.
export const size = { width: 96, height: 96 };
export const contentType = "image/png";

/** WRKL logomark (white), as an SVG data URI so ImageResponse renders the exact vector. */
const WRKL = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 112 104' fill='#fff'><path d='M0 0 L51 0 L38 48 L25.5 13 L13 48 Z'/><rect x='61' y='0' width='14' height='48'/><path fill-rule='evenodd' d='M75 0 H93 C101 0 101 26 93 26 H75 Z M78 8 H89 C94 8 94 18 89 18 H78 Z'/><path d='M74 22 L88 22 L104 48 L90 48 Z'/><rect x='0' y='56' width='14' height='48'/><path d='M14 80 L26 80 L51 56 L39 56 Z'/><path d='M14 80 L26 80 L51 104 L39 104 Z'/><rect x='61' y='56' width='15' height='48'/><rect x='61' y='90' width='44' height='14'/></svg>`;
const wrklSrc = `data:image/svg+xml;utf8,${encodeURIComponent(WRKL)}`;

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
          background: "#0A0A0A",
          borderRadius: 20,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
        <img src={wrklSrc} width={60} height={55} alt="" />
      </div>
    ),
    size,
  );
}
