#!/usr/bin/env node
/**
 * Guard against invisible headline text.
 *
 * The demo build of TypoGraphica maps most punctuation in its cmap but ships
 * EMPTY outlines for it. Such a character consumes advance width and draws
 * nothing, so a comma in a headline simply vanishes - silently, with no console
 * error and no failing build. That is how "Your inbox, read" shipped as
 * "Your inbox  read".
 *
 *   npm run check:glyphs               # against http://localhost:3000
 *   node scripts/check-glyphs.mjs URL
 *
 * The sets below were derived by rendering every printable ASCII character to a
 * canvas and counting ink pixels - see the note on re-deriving, below. Do not
 * trust glyph byte-length for this: both TypoGraphica and Mantira subroutinize
 * their outlines, so a 2-byte charstring can still draw a full letter.
 */

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = process.argv[2] || "http://localhost:3000";

/**
 * class -> the face it is set in.
 * `blank` is every printable ASCII character that face draws as nothing.
 * `sha256` pins the exact font file the set was measured from.
 *
 * Gelline (body/UI) and Combine Mantira Sans (.eyebrow) have no blank glyphs
 * at all, so only the display face needs guarding.
 */
const FACES = [
  {
    cls: "headline",
    face: "TypoGraphica",
    file: "src/app/fonts/Typographica.ttf",
    sha256: "b0ecf578601a9129",
    blank: `"#$%&'()*+,-/:;<=>?@[\\]^_\``,
  },
];

/**
 * To re-derive after swapping a font, render each character and look for ink:
 *
 *   const face = new FontFace('X', bytes); await face.load();
 *   document.fonts.add(face);
 *   ctx.font = '120px X'; ctx.fillText(ch, 20, 100);
 *   // zero opaque pixels + non-zero measureText().width  ->  blank glyph
 */

const decode = (s) =>
  s
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function extract(html, cls) {
  const re = new RegExp(
    `<(h1|h2|h3|h4|p|span|a|li|div)\\b[^>]*\\bclass="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)</\\1>`,
    "gi",
  );
  return [...html.matchAll(re)].map((m) => decode(m[2])).filter(Boolean);
}

let html;
try {
  const res = await fetch(TARGET);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  html = await res.text();
} catch (e) {
  console.error(`Could not fetch ${TARGET}: ${e.message}`);
  console.error("Start the dev server first (npm run dev), or pass a URL.");
  process.exit(2);
}

let problems = 0;

for (const { cls, face, file, sha256, blank } of FACES) {
  const actual = createHash("sha256")
    .update(readFileSync(join(ROOT, file)))
    .digest("hex")
    .slice(0, 16);

  if (actual !== sha256) {
    console.error(
      `\n${file} has changed (${actual}, expected ${sha256}).\n` +
        `The blank-glyph set in this script no longer applies. Re-derive it\n` +
        `with the canvas method documented at the top of this file, then update\n` +
        `both the set and the hash.`,
    );
    process.exit(1);
  }

  const blankSet = new Set(blank);
  const strings = extract(html, cls);
  console.log(`\n.${cls} -> ${face}`);
  console.log(`  draws nothing: ${blank}`);
  console.log(`  strings checked: ${strings.length}`);

  for (const s of strings) {
    const hits = [...new Set([...s])].filter((c) => blankSet.has(c));
    if (hits.length) {
      problems++;
      console.log(`  INVISIBLE ${hits.map((c) => `"${c}"`).join(", ")}  in: ${s}`);
    }
  }
}

if (problems) {
  console.log(
    `\nFAIL: ${problems} string(s) use a character the display face draws as nothing.\n` +
      `Reword to letters, digits, "." and "!", or set the text in Gelline instead.`,
  );
  process.exit(1);
}

console.log("\nOK: no headline copy relies on a blank glyph.");
