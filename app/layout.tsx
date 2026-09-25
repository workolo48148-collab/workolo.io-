import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import Script from "next/script";
import { ToastProvider } from "@/components/ui/toast";
import { founder, plans, site } from "@/lib/content";
import { GA4_ID, META_PIXEL_ID } from "@/lib/env";
import "./globals.css";

// Bodoni Moda: headlines (high-contrast luxury serif, only used large). Schibsted Grotesk: editorial body.
// JetBrains Mono: small ticker-style labels only, so it isn't preloaded.
const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-bodoni", display: "swap" });
const body = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0c" },
  ],
};

// Validated ids only (see lib/env.ts), so a blank or malformed value can't break the page or the inline scripts.
const GA_ID = GA4_ID;
const PIXEL_ID = META_PIXEL_ID;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.name,
      url: site.url,
      email: site.email,
      logo: `${site.url}/icon`,
      founder: { "@type": "Person", name: founder.name, jobTitle: "Founder" },
      ...(site.socials.length ? { sameAs: site.socials.map((s) => s.href) } : {}),
    },
    {
      "@type": "Service",
      "@id": `${site.url}/#service`,
      name: "Done-for-you Instagram content system for finance creators",
      serviceType: "Social media content marketing",
      description: site.description,
      provider: { "@id": `${site.url}/#org` },
      audience: { "@type": "Audience", audienceType: "Finance educators, traders, investing and wealth coaches, financial planners" },
      areaServed: "Worldwide",
      offers: plans.map((p) => ({
        "@type": "Offer",
        name: `${p.name}: ${p.volume}`,
        priceCurrency: "USD",
        price: p.price,
        priceSpecification: { "@type": "UnitPriceSpecification", price: p.price, priceCurrency: "USD", unitText: "MONTH" },
        url: `${site.url}/#pricing`,
      })),
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          // JSON-LD is static data built from lib/content.ts; escape "<" so it can't close the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <ToastProvider>{children}</ToastProvider>

        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
