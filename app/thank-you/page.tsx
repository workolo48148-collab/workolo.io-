import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ThankYouTracking } from "@/components/site/thank-you-tracking";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "You're booked | Workolo",
  description: "Your strategy call is confirmed. Check your email for the call details.",
  // Thank-you pages shouldn't appear in search results.
  robots: { index: false, follow: false },
};

export default function ThankYou() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      {/* Fires the Meta Pixel Lead/Schedule conversion when a booking lands here. */}
      <ThankYouTracking />

      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-[380px] max-w-3xl rounded-full bg-primary/20 blur-[120px]" />

      <div className="rise-in relative">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-primary text-primary-fg">
          <Check className="size-10" strokeWidth={3} />
        </span>
        <h1 className="mt-8 text-[clamp(2rem,6vw,3.5rem)] font-black uppercase leading-[1.05] tracking-tight">
          You&apos;re booked!
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-muted">
          Your strategy call is confirmed. Check your email for the call details and calendar invite.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "mt-10")}>
          Back to Workolo
        </Link>
      </div>
    </main>
  );
}
