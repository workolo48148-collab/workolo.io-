import type { Metadata, Viewport } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import Script from "next/script";
import { BookingProvider } from "@/components/site/booking-modal";
import { founder, plans, site } from "@/lib/content";
import { GA4_ID, META_PIXEL_ID } from "@/lib/env";
import "./globals.css";

// SIMPLE BOLD: Archivo (heavy, architectural grotesque) for every headline, label and button.
// Hanken Grotesk for body copy. Both carry weight without the old editorial serif.
const display = Archivo({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], style: ["normal", "italic"], variable: "--font-archivo", display: "swap" });
const body = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-hanken", display: "swap" });

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
  themeColor: "#0A0A0A",
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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* Warm up the connection to Cal.com so the booking pop-up loads fast.
            React hoists these <link> tags into <head>; no manual <head> element
            (which can cause hydration attribute mismatches in the App Router). */}
        <link rel="preconnect" href="https://app.cal.com" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
        <link rel="preconnect" href="https://cal.com" />
        <script
          type="application/ld+json"
          // JSON-LD is static data built from lib/content.ts; escape "<" so it can't close the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <BookingProvider>{children}</BookingProvider>

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
