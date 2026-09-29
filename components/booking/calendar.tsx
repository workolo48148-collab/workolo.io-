"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { addDays, daysInMonth, formatDateKey, weekdayOf } from "@/lib/booking/tz";
import { cn } from "@/lib/utils";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

type Props = {
  month: string;
  today: string;
  minMonth: string;
  maxMonth: string;
  available: Set<string>;
  loading: boolean;
  selected: string | null;
  onSelect: (dateKey: string) => void;
  onMonthChange: (month: string) => void;
};

/**
 * Month grid (WAI-ARIA grid pattern). Arrow keys move by day/week, Home/End to
 * week edges, PageUp/PageDown by month, Enter/Space selects. Unavailable days
 * stay focusable (aria-disabled) so keyboard users can move through them.
 */
export function Calendar({ month, today, minMonth, maxMonth, available, loading, selected, onSelect, onMonthChange }: Props) {
  const days = daysInMonth(month);
  const lead = weekdayOf(days[0]);
  const cells: (string | null)[] = [...Array(lead).fill(null), ...days];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  // null until the visitor moves focus themselves; until then the tab stop follows the selection.
  const [focusKey, setFocusKey] = React.useState<string | null>(null);
  const effectiveFocus =
    focusKey?.startsWith(month) ? focusKey : selected?.startsWith(month) ? selected : today.startsWith(month) ? today : days[0];
  const gridRef = React.useRef<HTMLTableElement>(null);
  const wantFocus = React.useRef(false);

  React.useEffect(() => {
    if (!wantFocus.current) return;
    wantFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${effectiveFocus}"]`)?.focus();
  }, [effectiveFocus, month]);

  const canPrev = month > minMonth;
  const canNext = month < maxMonth;

  function moveTo(key: string) {
    const target = key.slice(0, 7);
    if (target < minMonth || target > maxMonth) return;
    wantFocus.current = true;
    setFocusKey(key);
    if (target !== month) onMonthChange(target);
  }

  function onKeyDown(e: React.KeyboardEvent, key: string) {
    const wd = weekdayOf(key);
    const map: Record<string, () => string> = {
      ArrowLeft: () => addDays(key, -1),
      ArrowRight: () => addDays(key, 1),
      ArrowUp: () => addDays(key, -7),
      ArrowDown: () => addDays(key, 7),
      Home: () => addDays(key, -wd),
      End: () => addDays(key, 6 - wd),
      PageUp: () => `${shiftMonth(key.slice(0, 7), -1)}-01`,
      PageDown: () => `${shiftMonth(key.slice(0, 7), 1)}-01`,
    };
    if (map[e.key]) {
      e.preventDefault();
      moveTo(map[e.key]());
    }
  }

  const label = formatDateKey(`${month}-01`, { month: "long", year: "numeric" });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-sans text-base font-semibold tracking-normal" id="cal-label" aria-live="polite">
          {label}
          {loading && <span className="ml-2 text-sm font-normal text-muted">Loading…</span>}
        </h4>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onMonthChange(shiftMonth(month, -1))}
            disabled={!canPrev}
            className="grid size-9 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(shiftMonth(month, 1))}
            disabled={!canNext}
            className="grid size-9 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <table ref={gridRef} role="grid" aria-labelledby="cal-label" aria-busy={loading || undefined} className="w-full table-fixed border-separate border-spacing-1">
        <thead>
          <tr>
            {DOW.map((d) => (
              <th key={d} scope="col" abbr={d} className="pb-1 text-xs font-medium text-muted">
                {d.slice(0, 2)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((key, di) => {
                if (!key) return <td key={di} role="gridcell" />;
                const isPast = key < today;
                const isAvail = !loading && !isPast && available.has(key);
                const isSelected = key === selected;
                const isToday = key === today;
                return (
                  <td key={key} role="gridcell" aria-selected={isSelected || undefined}>
                    <button
                      type="button"
                      data-date={key}
                      tabIndex={key === effectiveFocus ? 0 : -1}
                      aria-disabled={!isAvail || undefined}
                      aria-current={isToday ? "date" : undefined}
                      aria-label={`${formatDateKey(key)}${isToday ? ", today" : ""}${isAvail ? ", available" : ", no times available"}`}
                      onKeyDown={(e) => onKeyDown(e, key)}
                      onFocus={() => setFocusKey(key)}
                      onClick={() => isAvail && onSelect(key)}
                      className={cn(
                        "relative mx-auto grid aspect-square w-full max-w-11 place-items-center rounded-md text-sm tabular-nums",
                        isAvail && !isSelected && "bg-[rgb(var(--glow)/0.12)] font-semibold text-text hover:bg-[rgb(var(--glow)/0.24)]",
                        !isAvail && "cursor-default text-muted/60",
                        isPast && "line-through decoration-muted/40",
                        isSelected && "bg-primary font-semibold text-primary-fg shadow-sm",
                      )}
                    >
                      {Number(key.slice(8))}
                      {isToday && (
                        <span
                          aria-hidden
                          className={cn("absolute bottom-1 size-1 rounded-full", isSelected ? "bg-primary-fg" : "bg-accent")}
                        />
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { shiftMonth };
