import { cn } from "@/lib/utils";

/** Section header: optional mono kicker, Bodoni headline, optional lead. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  id?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="label-mono mb-5 text-muted">{eyebrow}</p>}
      <h2 id={id} className="text-4xl">
        {title}
      </h2>
      {lead && <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}
