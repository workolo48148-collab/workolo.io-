// Verifies every token text/background pairing against WCAG 2.1 AA.
// Parses the hex values straight out of app/globals.css so the check can't drift.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function block(source) {
  const vars = {};
  for (const [, name, hex] of source.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)) vars[name] = hex;
  return vars;
}
const light = block(css.slice(css.indexOf(":root {"), css.indexOf("@media (prefers-color-scheme: dark)")));
// Dark tokens end where the .tone-flip section overrides begin (those mirror the two blocks).
const darkEnd = css.indexOf(".tone-flip {") > 0 ? css.indexOf(".tone-flip {") : css.indexOf("@theme inline");
const dark = { ...light, ...block(css.slice(css.indexOf("@media (prefers-color-scheme: dark)"), darkEnd)) };

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
  ["primary-fg", "primary", 4.5, "primary button label"],
  ["primary-fg", "primary-hover", 4.5, "primary button label (hover)"],
  ["success", "success-bg", 4.5, "success message"],
  ["success", "surface", 4.5, "success text on cards"],
  ["danger", "danger-bg", 4.5, "error message"],
  ["danger", "surface", 4.5, "inline field error"],
  ["ring", "bg", 3, "focus ring (UI)"],
  ["ring", "surface", 3, "focus ring on cards (UI)"],
  ["input", "surface", 3, "form control border (UI)"],
  ["input", "bg", 3, "form control border on page (UI)"],
];

let failed = 0;
for (const [mode, vars] of [["light", light], ["dark", dark]]) {
  console.log(`\n${mode.toUpperCase()}`);
  for (const [fg, bg, min, label] of pairs) {
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
