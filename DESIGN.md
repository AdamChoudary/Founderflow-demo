# FounderFlow — design source of truth

Read this before touching any visual code. Every design agent on this project
starts here.

## The product

FounderFlow — "Your AI Executive Chief of Staff". It reads a founder's Gmail
overnight through a 6-expert Mixture-of-Experts pipeline and delivers one
morning briefing. Audience: startup founders. The feeling to sell is **arrival
at rest** — the work already happened while you slept; here is the answer.

## Current verdict from the owner

> "the green color is so rubbish and you didn't blend and mix colors properly
> across the whole landing page, it still feels divided not connected"
> "this is the ugliest thing I have ever seen"

Treat that as correct and diagnose from it. Do not defend existing choices.

## Measured diagnosis (numbers, not opinion)

Palette in OKLCH:

| token | hex | L | C | H |
|---|---|---|---|---|
| moss | `#1E3120` | 0.291 | **0.039** | 147 |
| forest | `#2F4F2F` | 0.393 | **0.065** | 144 |
| fern | `#556B2F` | 0.496 | **0.090** | 126 |
| bark | `#A0522D` | 0.526 | 0.115 | 45 |
| bone | `#DAD4A7` | 0.863 | 0.060 | 101 |
| lime | `#9CFC00` | 0.896 | **0.248** | 132 |
| paper | `#FCFCFC` | 0.991 | 0.000 | — |

**The core failure.** Every green is a low-chroma desaturated olive (0.039 to
0.090) and then lime sits at 0.248 — three to six times the chroma of anything
else, at a lightness of 0.896. It is not an accent in the family, it is a neon
spike on a field of army surplus. There is no crisp neutral, no clean dark, no
mid-chroma anything. The whole page reads muddy and military rather than
premium.

Two tokens were added to patch this (`sap` at C 0.19, `clay`, `ember`). They
are patches on a broken foundation, not a system. **The palette needs to be
rebuilt as a system, not extended again.**

**Section grounds** run moss → bone → bone → forest → bone → bark → moss. Six
ground changes with a lightness sawtooth. A `.seam` system now bridges them
(steepest ground step went 0.58 → 0.11 per 40px) but bridging bad adjacencies
is not the same as choosing good ones.

## Hard constraints — do not violate

**Fonts.** Three faces, one Regular weight each, no bold, no italic.
`font-synthesis: none` is set globally so the browser cannot fake them.
Hierarchy comes from size, colour, case and letter-spacing ONLY.

- TypoGraphica — display headings (`.headline`)
- Gelline — body and UI
- Combine Mantira Sans — eyebrows, numerals (`.font-accent`)

**TypoGraphica ships empty outlines for most punctuation.** Display copy may
use letters, digits, `.` and `!` only. Everything in ``"#$%&'()*+,-/:;<=>?@[\]^_` ``
renders as blank space — no error, the punctuation silently vanishes.
`npm run check:glyphs` guards this. None of the three faces has an em-dash,
curly apostrophe or arrow; use hyphens, straight apostrophes, and the SVG
arrows in `components/icons.tsx`.

All three fonts are **personal-use licences**. Flagged, owner chose to proceed.

**Stack.** Next.js 16.2.12, React 19.2.4, Tailwind CSS v4.3.3 (CSS-first
`@theme` in `globals.css`, there is no tailwind.config.js and none should be
added). TypeScript. No new npm dependencies without a stated reason.

**Logo** is `#FCFCFC` white + `#9CFC00` lime on transparent, used on dark only.
The lime in the logo is fixed. How much lime appears elsewhere is not.

## Accessibility floor — non-negotiable

Every text element must clear WCAG AA on its real rendered ground: **4.5:1**
below 24px, **3:1** at 24px and above. There is no bold cut in any of these
faces, so the 18.66px-bold allowance never applies — 24px is the only large
text threshold on this project.

## The measurement harness — use it, do not guess

Scratchpad: `/private/tmp/claude-501/-Users-mac-Developer-Personal-Projects-Stacy-Demo-design-my-app/6a52df87-cfcf-475e-8371-44bb7ed4144d/scratchpad/`

| script | what it proves |
|---|---|
| `node textboxes.mjs [w] [h] [tag]` then `python3 measure.py [tag]` | per-element contrast on **rendered pixels**, every text node on the page |
| `node verify.mjs` | fonts loaded, no missing glyphs, no overflow at 390/768/1440/2560, console clean |
| `node motion.mjs` | living animation + reduced-motion parity |
| `node tabs.mjs` / `a11y.mjs` / `hover.mjs` | keyboard, focus rings, pointer states |
| `node shift.mjs` | layout stability across breakpoints |
| `node briefing.mjs` / `outcomes.mjs` / `scrub.mjs` / `heroexit.mjs` | per-section behaviour |

The contrast analyser has been wrong three times in this project's history —
it string-matched colour names, guessed backgrounds from inside glyph boxes,
and composited alpha in luminance space instead of sRGB. It is now correct:
foreground resolved by painting to a canvas, background composited
analytically from ancestor backgrounds with a pixel-ring fallback for
gradients and photographs. **Trust its numbers; do not re-derive them by eye.**

## Working rules for this project

1. **Measure before you claim.** Every colour, contrast and spacing assertion
   must come from the harness or a computed value, never from looking.
2. **No new animation** unless it carries meaning the copy does not already
   carry. The owner has explicitly called unwanted animation out. Existing
   motion is documented in `docs/design-phases.md`; prefer cutting to adding.
3. **Reduced motion parity.** Every animation must resolve to its finished,
   meaningful state under `prefers-reduced-motion: reduce`.
4. **Fix the system, not the instance.** Three one-off colour tokens is how
   this palette got into trouble.
