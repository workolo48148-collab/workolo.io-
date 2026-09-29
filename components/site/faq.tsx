import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { faqs } from "@/lib/content";
import { Section } from "./sections";
import { SectionHeading } from "./section-heading";

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title" className="border-t border-border" lazy>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <SectionHeading id="faq-title" align="left" title="FAQ" />
        <Accordion>
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} name="faq" title={f.q} defaultOpen={i === 0}>
              <div className="space-y-3">
                {f.a.map((block, j) => {
                  if (typeof block === "string") return <p key={j}>{block}</p>;
                  const List = block.ordered ? "ol" : "ul";
                  return (
                    <div key={j}>
                      {block.title && <p className="mb-1.5 font-semibold text-text">{block.title}</p>}
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
      </div>
    </Section>
  );
}
