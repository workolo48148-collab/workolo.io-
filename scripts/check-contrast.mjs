// Verifies every token text/background pairing against WCAG 2.1 AA.
// Parses the hex values straight out of app/globals.css so the check can't drift.
// Two tones: the black page (:root) and the white `.tone-flip` sections.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function block(selector) {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`${selector} block not found in globals.css`);
  const source = css.slice(start, css.indexOf("}", start));
  const vars = {};
  for (const [, name, hex] of source.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)) vars[name] = hex;
  return vars;
}
const black = block(":root");
const flip = block(".tone-flip");
const white = { ...black, ...flip };

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, minimum ratio, what it is]
const pairs = [
  ["text", "bg", 4.5, "body text"],
  ["text", "surface", 4.5, "text on cards"],
  ["text", "surface-2", 4.5, "text on muted surface"],
  ["muted", "bg", 4.5, "secondary text"],
  ["muted", "surface", 4.5, "secondary text on cards"],
  ["muted", "surface-2", 4.5, "secondary text on muted surface"],
  ["accent", "bg", 4.5, "accent text"],
  ["accent", "surface", 4.5, "accent text on cards"],
  ["star", "bg", 3, "star rating (UI)"],
  ["star", "surface", 3, "star rating on cards (UI)"],
  ["primary-fg", "primary", 4.5, "primary button label"],
  ["primary-fg", "primary-hover", 4.5, "primary button label (hover)"],
  ["success", "success-bg", 4.5, "success message"],
  ["success", "surface", 4.5, "success text on cards"],
  ["danger", "danger-bg", 4.5, "error message"],
  ["danger", "surface", 4.5, "inline field error"],
  ["accent", "surface", 3, "invalid field border (UI)"],
  ["accent", "danger-bg", 3, "error box border (UI)"],
  ["ring", "bg", 3, "focus ring (UI)"],
  ["ring", "surface", 3, "focus ring on cards (UI)"],
  ["input", "surface", 3, "form control border (UI)"],
  ["input", "bg", 3, "form control border on page (UI)"],
];

// Success states only appear in the booking widget, which always sits on the black page,
// so .tone-flip doesn't define (or need) success tokens.
const onlyWhereDefined = (vars, own) => pairs.filter(([fg, bg]) => !fg.startsWith("success") || (fg in own && bg in own) || vars === black);

let failed = 0;
for (const [mode, vars, own] of [["black (:root)", black, black], ["white (.tone-flip)", white, flip]]) {
  console.log(`\n${mode.toUpperCase()}`);
  for (const [fg, bg, min, label] of onlyWhereDefined(vars, own)) {
    const r = ratio(vars[fg], vars[bg]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${fg} on ${bg} - ${label}`);
  }
}
if (failed) {
  console.error(`\n${failed} pairing(s) below AA`);
  process.exit(1);
}
console.log("\nAll pairings meet WCAG 2.1 AA.");
