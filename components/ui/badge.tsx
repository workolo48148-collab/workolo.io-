import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium [&_svg]:size-3.5", {
  variants: {
    variant: {
      neutral: "border-border bg-surface text-muted",
      accent: "border-[rgb(var(--glow)/0.45)] bg-[rgb(var(--glow)/0.12)] text-accent",
      success: "border-transparent bg-success-bg text-success",
      solid: "border-transparent bg-primary text-primary-fg",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
