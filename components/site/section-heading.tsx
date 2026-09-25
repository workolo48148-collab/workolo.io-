import { cn } from "@/lib/utils";

/** Editorial section header: numbered mono kicker, Bodoni headline, optional lead. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  id,
  align = "center",
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  id?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("label-mono mb-5 flex items-center gap-3 text-muted", align === "center" && "justify-center")}>
          {index && <span className="text-accent">{index}</span>}
          {index && <span aria-hidden className="h-px w-8 bg-border-strong" />}
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="text-4xl">
        {title}
      </h2>
      {lead && <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}
