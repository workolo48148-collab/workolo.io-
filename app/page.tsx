import { Faq } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { Audience, FinalCta, Founder, HowItWorks, Pricing, Proof } from "@/components/site/sections";
import { StickyCta } from "@/components/site/sticky-cta";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 font-semibold text-primary-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <main id="main">
        {/* Order follows the client brief: Hero → Wall of proof → Who is it for → About me
            → How we work → FAQ → Packages → Book a call. Booking lives in a pop-up (see
            BookingProvider), opened by every CTA — it no longer sits inline while scrolling. */}
        <Hero />
        <Proof />
        <Audience />
        <Founder />
        <HowItWorks />
        <Faq />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
