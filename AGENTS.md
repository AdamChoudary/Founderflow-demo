<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Brand

## Fonts — licensing (read before shipping publicly)

All three faces in `src/app/fonts/` are licensed **for personal use only**.
Commercial use requires buying a licence from each foundry:

| Font | Role | Foundry | Commercial licence |
|---|---|---|---|
| TypoGraphica | display headings | Sharkshock (Dennis Ludlow) | sharkshock.net/license |
| Gelline | body and UI | Brandsemut | brandsemut.com/product/gelline/ |
| Combine Mantira Sans | eyebrows, numerals | Lettersweet | creativefabrica.com/product/combine-montira/ |

They are wired through the `--font-display` / `--font-body` / `--font-accent`
tokens in `globals.css`, so replacing them is a change in two files
(`layout.tsx` and the font directory), not a change across every component.

## Fonts — single weight

Every face ships **one Regular cut**: no bold, no italic. `font-synthesis: none`
is set globally so the browser cannot fake them. Build hierarchy from size,
colour, case and letter-spacing instead — never `font-weight`.

## Fonts — invisible glyphs (the sharp edge)

TypoGraphica's demo build maps punctuation in its cmap but ships **empty
outlines** for most of it. Those characters take up advance width and draw
nothing: no error, no warning, the text just silently loses its punctuation.

**Display copy (`.headline`) may use letters, digits, `.` and `!` only.**
Everything in `"#$%&'()*+,-/:;<=>?@[\]^_`` renders as blank space.

Gelline and Combine Mantira Sans have **no** blank glyphs — body copy and
eyebrows can use full punctuation freely.

`npm run check:glyphs` (against a running dev server) fetches the page and
fails if any `.headline` string uses a character the display face cannot draw.
It pins the font file by hash, so swapping a font makes it fail loudly rather
than silently going stale.

Do **not** test this by glyph byte-length: all three fonts subroutinize their
outlines, so a 2-byte charstring can still draw a full letter. Render the
character and look for ink — the method is documented in the script.

Separately, none of the three has an em-dash `—`, curly apostrophe `’`, or
arrow `→`. Use hyphens, straight apostrophes, and the SVG arrows in
`components/icons.tsx`.

## Before deploying

Set **`NEXT_PUBLIC_SITE_URL`** to the real origin. It feeds `metadataBase` in
`layout.tsx`; without it `og:image` resolves against `http://localhost:3000`
and every link preview points at a machine nobody else can reach.

The OG card at `src/app/opengraph-image.png` is a 1200x630 screenshot of the
real hero, so it cannot drift from the site's own type and colour. Regenerate
it whenever the hero copy changes — the script that produced it is in the
session scratchpad; it loads the page, strips the nav and dev badge, injects
the logo, and screenshots the viewport.

Note: `opengraph-image.alt.txt` is documented by Next but emits no
`og:image:alt` in 16.2.12, with or without an explicit `openGraph` block. The
file was removed rather than left in place doing nothing.

## Colour

Palette lives in the `@theme` block of `globals.css`. Measured contrast:

- Body text on `bone`: use `moss` (9.2:1) or `forest` (6.1:1) only.
- `fern` (3.9:1) and `bark` (3.7:1) on `bone`: **large text only**.
- `fern` / `bark` on `moss` fail entirely (2.3, 2.5) — fills and rules, never text.
- `sap` (`oklch(0.78 0.19 132)`) carries every SECONDARY accent on a dark
  ground - rules, signals, eyebrows, node rings, confidence figures. 7.28:1 on
  moss, 4.84:1 on forest. **Never on bone** - 1.26:1 there.
- `lime` is the single signal accent and nothing else: the three CTA buttons,
  the one live alert in the briefing card, `::selection` and the focus ring.
  It was on 49 elements; at chroma 0.248 against a field where nothing else
  exceeds 0.09, that is not an accent, it is noise. sap exists to give it
  something to relate to.

## Section seams

No section may butt directly against the next. Each boundary is bridged by a
`.seam` - a band of the neighbour's ground fading across the join - and both
sides reach exactly halfway so they meet at the same blend. Reaching full
strength on both sides is WORSE than no seam: it puts the two grounds swapped
against each other. Measured steepest ground step per 40px: 0.58 raw, 0.35
full-strength reciprocal, 0.11 capped at 50%.

Seam height is `min(14rem, 26%)`. The percentage is load-bearing - at a flat
14rem the shortest section on the page came out 97% covered by its own seams.
- `ember` (bark 50% + bone 50%, `#BD936A`) is bark made legible on a dark
  ground: 4.98:1 on `moss`. It exists so the briefing card can carry a warm
  alarm colour without spending the lime accent. **Dark grounds only** - on
  `bone` it is 1.8:1 and effectively invisible.

Measure per element, on rendered pixels, and resolve the foreground colour by
painting it rather than by matching colour names. `scripts`-adjacent harnesses
that string-match a palette will pass anything they do not recognise.
