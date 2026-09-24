import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms | Workolo",
  description: "Terms for using workolo.io and booking a discovery call.",
  alternates: { canonical: "/terms" },
};

// NOTE FOR WORKOLO: website-use terms only. Service terms (minimum commitment,
// cancellation, payment) are not defined on the current site. Add them here.
export default function TermsPage() {
  return (
    <LegalPage title="Terms" updated="September 24, 2026">
      <p>By using workolo.io or booking a call, you agree to these terms.</p>

      <h2>Discovery calls</h2>
      <p>
        A discovery call is a conversation to see whether our content service fits your business. Booking a call doesn&apos;t commit you or
        us to any engagement. If you need to change the time, use the reschedule link on your confirmation or email{" "}
        <a href="mailto:hello@workolo.io">hello@workolo.io</a>.
      </p>

      <h2>No financial advice</h2>
      <p>We create marketing content. We don&apos;t give financial advice, and we don&apos;t promise trading or investment results.</p>

      <h2>Pricing</h2>
      <p>
        Package prices shown on the site are in US dollars per month. The scope and terms of any engagement are agreed in writing before work
        starts.
      </p>

      <h2>Website content</h2>
      <p>The content on this site belongs to Workolo. Please don&apos;t copy it without permission.</p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:hello@workolo.io">hello@workolo.io</a>
      </p>
    </LegalPage>
  );
}
