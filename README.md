# Founderflow-demo

Marketing site for FounderFlow - an AI executive chief of staff that reads a
founder inbox overnight through a six-expert pipeline and leaves one briefing.

Next.js 16 - React 19 - Tailwind CSS v4 (CSS-first, no tailwind.config.js).

## Getting started

```bash
npm install
npm run dev
```

| script | does |
|---|---|
| `npm run dev` | dev server on :3000 |
| `npm run build` | production build |
| `npm run check:glyphs` | fails if display copy uses a character the display face cannot draw |

## Read before changing anything visual

- **`DESIGN.md`** - source of truth: palette system, hard font constraints,
  the accessibility floor and the measurement harness.
- **`AGENTS.md`** - brand rules, including the blank-glyph trap.
- **`docs/design-phases.md`** - what was built and why.

## Fonts

All three faces are licensed for **personal use only**. Commercial use
requires buying a licence from each foundry - see `AGENTS.md`.
