import { AlertCircle, ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

// Invalid fields get a 2px accent border (no red); the message below adds an icon and bold text.
const control =
  "w-full rounded-md border border-input bg-surface px-3.5 text-base text-text shadow-sm placeholder:text-muted/80 hover:border-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgb(var(--glow)/0.35)] aria-invalid:border-2 aria-invalid:border-accent aria-invalid:hover:border-accent disabled:cursor-not-allowed disabled:opacity-60";

/** Error line under a field: the alert icon + bold text, so it's obvious without colour. */
export function FieldError({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <p id={id} className={cn("mt-1.5 flex items-start gap-1.5 text-xs font-bold text-danger", className)}>
      <AlertCircle className="mt-px size-3.5 shrink-0 text-accent" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(control, "h-11", className)} {...props} />;
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(control, "min-h-24 resize-y py-2.5 leading-relaxed", className)} {...props} />;
  },
);

/** Native select, styled. Native keeps the OS picker on mobile, which converts better than custom listboxes. */
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select ref={ref} className={cn(control, "h-11 cursor-pointer appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  );
});

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-text", className)} {...props} />;
}

/** Label + control + hint/error wiring with the right aria attributes. */
export function Field({
  id,
  label,
  required,
  optional,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  hint?: React.ReactNode;
  error?: string;
  className?: string;
  children: (a11y: { id: string; "aria-invalid"?: true; "aria-describedby"?: string; required?: boolean }) => React.ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <Label htmlFor={id}>
        {label}
        {required && <span aria-hidden className="text-accent"> *</span>}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </Label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": [hintId, errId].filter(Boolean).join(" ") || undefined,
        required,
      })}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && <FieldError id={errId}>{error}</FieldError>}
    </div>
  );
}
