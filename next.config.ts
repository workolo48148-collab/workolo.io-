import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Shown at /api/health so you can tell which build is live.
  env: { NEXT_PUBLIC_BUILD_TIME: new Date().toISOString() },
  // WebP only: AVIF processing (sharp/libheif) was the path for GHSA-2xp9-vwfh-vxw4, a critical RCE.
  images: { formats: ["image/webp"] },
  // Serve the generated WRKL icon at the legacy /favicon.ico path. Google and some
  // crawlers request /favicon.ico directly; without this it 404s and they fall back
  // to a generic globe. The <link rel="icon"> in <head> still points at /icon.
  async redirects() {
    return [{ source: "/favicon.ico", destination: "/icon", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
