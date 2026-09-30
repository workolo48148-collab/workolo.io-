import { ArrowRight } from "lucide-react";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { ctaLabel, faqs } from "@/lib/content";
import { CtaLink } from "./cta-link";
import { Section } from "./sections";

/**
 * SIMPLE BOLD FAQ: solid brand-blue block, big centred heading, flat white
 * accordion cards, and a dark CTA underneath — the reference layout.
 */
export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title" className="tone-blue" lazy>
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-title" className="text-center text-5xl font-black uppercase tracking-tight">
          FAQ
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted">
          Everything finance experts ask before starting.
        </p>

        <Accordion className="mt-12">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} name="faq" title={f.q} defaultOpen={i === 0}>
              <div className="space-y-3">
                {f.a.map((block, j) => {
                  if (typeof block === "string") return <p key={j}>{block}</p>;
                  const List = block.ordered ? "ol" : "ul";
                  return (
                    <div key={j}>
                      {block.title && <p className="mb-1.5 font-semibold text-neutral-900">{block.title}</p>}
                      <List className={block.ordered ? "list-decimal space-y-1 pl-5" : "list-disc space-y-1 pl-5"}>
                        {block.list.map((li) => (
                          <li key={li}>{li}</li>
                        ))}
                      </List>
                    </div>
                  );
                })}
              </div>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 flex justify-center">
          <CtaLink location="faq" size="lg" className="w-full sm:w-auto">
            {ctaLabel} <ArrowRight />
          </CtaLink>
        </div>
      </div>
    </Section>
  );
}
