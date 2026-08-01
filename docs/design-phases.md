# FounderFlow — phased design deep-dive

Built from four parallel research passes (component libraries, SVG/canvas, text
motion, scroll systems) run 31 Jul 2026, each briefed with this repo's real
constraints. Every claim below was checked against the codebase, `caniuse`, or
the `webstatus.dev` API — not blog posts.

---

## The three verdicts that shape everything

**1. Add no dependencies.** The libraries were surveyed properly and roughly
60% of what they sell already exists here under different names: `.spot::after`
is Magic UI's Shine Border, `.bloom` is Aceternity's Spotlight, `.trace` is a
degenerate Animated Beam, `.line > span` is GSAP SplitText's line reveal,
`CountUp` is Number Ticker. What remains is reachable in CSS plus **~30 lines
of JS across the whole page**.

**2. No GSAP.** It is genuinely free now (Webflow, Apr 2025, all plugins) and
the real transfer cost is ~41 KB brotli, not the ~70 KB I previously quoted.
The objection is architectural, not financial:

- Scrubbed CSS timelines run **on the compositor**; a GSAP scrub runs on the
  main thread, one frame behind the scroll. For scrubbing, CSS is *strictly
  better*, not merely equal.
- ScrollTrigger's `pin` injects a `pin-spacer`, jumps on iOS URL-bar resize,
  and needs `refresh()` bookkeeping. `position: sticky` has none of that.
- GSAP does not respect `prefers-reduced-motion` unless wired through
  `gsap.matchMedia()`. That moves half the motion system into JS where nothing
  enforces it — and this repo's single-source-of-truth reduced-motion
  discipline is its best asset.

Revisit only for interruptible physics/gesture motion or SVG path morphing.
Neither is on this page.

**3. Scroll-driven CSS is the unlock.** `animation-timeline: view()/scroll()`
is Chrome 115+, Safari 26+, Firefox 156 (flagged through 155) — **~84%**, with
`Reveal.tsx` already in place as the fallback. Not Baseline, but the failure
mode is "gets the one-shot reveal instead", which is fine.

---

## Phase 0 — correctness. Do first, it is nearly free

Bugs the research surfaced in existing code.

| # | Bug | Fix |
|---|---|---|
| 0.1 | **`CountUp` announces nothing.** `aria-label` on a `<span>` is *prohibited* — `generic` is a name-prohibited role, and both children are `aria-hidden`. Every stat is invisible to AT. | `role="img"` on the wrapper. One attribute. |
| 0.2 | **The reduced-motion reset misses scroll-driven animations.** `animation-duration` is ignored on a progress-based timeline, so every scroll animation added later would run at full amplitude for reduced-motion users. | Add `animation-timeline: auto !important` to the global reset. |
| 0.3 | **`.line` clips ascenders.** `--text-d1--line-height: 1` means the content box is exactly 1em; the descender padding covers the bottom only. | Symmetric `padding-block: 0.10em 0.14em` + matching negative margins. |
| 0.4 | **`.line` shears focus rings.** `overflow: hidden` clips the 2px/3px-offset ring on any focusable inside. | `.line:has(:focus-visible) { overflow: visible }` |
| 0.5 | **Centred eyebrows sit optically left.** CSS adds `letter-spacing` after the final glyph too. | `margin-right: -0.22em` on `.eyebrow`. |
| 0.6 | **`will-change: transform` left standing** on `.bloom`. Permanent GPU memory per element. | Only while animating, or drop it. |
| 0.7 | **Overshoot easing used twice.** A wink used twice is a mannerism. | Keep `--ease-back` on one element. |

## Phase 1 — motion recalibration. The biggest quality win on the list

The harshest finding, and correct: **the page's motion is slow, not calm.**

| Current | Target | Source |
|---|---|---|
| `SETTLE_MS = 2800` | ~900 | total staggered chain should be ≤600ms |
| tile stagger base 1150ms, step 485ms | base ~220ms, step ~60ms | 40–70ms for ≤6 items |
| card reveal 900ms | 420–620ms | block reveals |
| hover in/out symmetric | 120–160ms in, 220–280ms out | fast to acknowledge, slow to release |

A 485ms gap between siblings is nearly half a second of dead air. The eye has
already arrived and is waiting for the interface — which reads as *slow
software*, not elegance. This phase mostly **deletes numbers**.

Also: travel distance 8–24px, not 40–60px. One or two things move, the rest
cross-fade.

---

## Phase 2 — Hero

| Item | Technique | Cost |
|---|---|---|
| Hero exit hand-off | fade + 1.02→1 scale + 2px blur over `animation-range: exit 0% exit 100%` | 8 CSS lines |
| Atmosphere parallax | two layers, `scroll(root block)`, **≤64px total travel** | 6 CSS lines |
| Sheen on one word | `@property --sheen` as `<percentage>` + `background-clip: text` | 12 lines |

Sheen is contrast-proven on moss: bone 9.21:1, lime 10.78:1, paper 13.51:1 —
every stop clears AAA, so an animated gradient is safe *here specifically*.
**Never over the photograph** (no computable floor) and **never on paper**
(lime on paper is 1.25:1). Requires a `forced-colors: active` fallback or the
text vanishes in High Contrast.

## Phase 3 — Briefing dashboard

| Item | Technique |
|---|---|
| Decrypt-resolve on subject lines | ~22 lines JS under the existing `.scan-pass`; charset restricted to `A-Za-z0-9@.` so width never jumps; real text in a `.vh` sibling, animating node `aria-hidden` |
| Border beam, one lap ~16s | `offset-path: rect(...)` + `offset-distance` — **natively animatable, zero JS** |
| Convergence scrub | six rules drawing into one card, staggered `animation-range` |

The scan pass currently sweeps over content that was always legible — it
asserts classification without showing it. Decrypt makes the sweep *do*
something. Card takes the beam **or** `.spot`, never both.

## Phase 4 — Outcomes

Digit-roll replacing count-up: counting up says *calculating*; rolling into
place says *arrived, settled, final* — which is the "one briefing" promise.
Also the most templated number treatment on the web right now.

## Phase 5 — Experts

The section's thesis, currently unstated: **six self-drawing curves converging
on one node.** `pathLength="1"` + `stroke-dasharray: 1` + `stroke-dashoffset`
— six curves of different real lengths share one set of dash numbers, so it is
~25 lines of TSX and 12 of CSS, at 100% browser support.

This is the only technique where the *mechanism and the message are the same
thing*. The line is literally converging.

Plus View Transitions on the tab swap (native FLIP, replaces the `panel-in`
re-key), and selecting expert *n* brightens beam *n*.

## Phase 6 — Pipeline

`position: sticky` stage inside a 400vh track, scrubbed with
`view-timeline` + `animation-range: contain`. `contain` maps 1:1 onto the
pinned interval; `cover` would waste two viewports.

Must also collapse the track under reduced motion, or those users scroll four
blank screens.

## Phase 7 — Integrations, Statement, CTA, Nav, Footer

- **Nav:** scroll progress rail, `scroll(root block)`, 3 lines. Deliberately
  *outside* the reduced-motion gate — a progress bar is a 1:1 map of the user's
  own input, not autonomous motion; removing it removes information.
- **Nav:** `IntersectionObserver` section highlight, `rootMargin: -45% 0 -45%`.
  Chosen over the CSS-only version because it can set `aria-current`.
- **Statement:** word-by-word scroll resolve. **Dim floor 0.65, not the 0.28
  every demo uses** — 0.28 measures 2.03:1 on moss and fails outright.
  Split server-side with `Intl.Segmenter`, spans kept `display: inline` so
  selection and find-in-page survive.
- **CTA:** ambient traces at 17s/23s/29s. The one section that should feel like
  3am currently has nothing running in it.
- **Integrations:** a static grid with a small stagger. A marquee says "we have
  many"; a grid says "we chose these" — and infinite loops contradict a brand
  whose thesis is arrival at rest.
- **Perf:** `content-visibility: auto` + `contain-intrinsic-size` on below-fold
  sections. Never on anything carrying a `view-timeline`.

---

## Do not ship

**Per-character splitting** — three independent reasons. TypoGraphica ships
empty outlines for most punctuation, so a char stagger animates invisible boxes
and leaves dead beats. Roselli's Feb 2026 testing found `aria-hidden` + parent
`aria-label` fails on 5 of 8 screen-reader/browser pairs. And it is the
Framer-template signature.

**Scramble / typewriter** — random glyph draws hit blank outlines; proportional
metrics jitter line width every frame; says *hacker terminal* where the brand
says *calm arriving*. A typewriter also says "still working" against copy that
promises "already finished when you wake".

**Orbiting circles for six→one** — orbit is perpetual separation. It says
nothing converges.

**Gooey metaball merge** — the most literal six→one available, which is exactly
why it's wrong: it reads playful and liquid, not trustworthy.

**Infinite marquee** — WCAG 2.2.2 pause obligation, and philosophically opposed
to arrival at rest.

**Meteors / sparkles / aurora / warp / retro-grid** — all ship purple→blue→pink
by default and would read as a different website pasted on top of a
moss/bark/bone palette with one lime accent.

**Also rejected:** Lenis (fights the OS, moves scroll to the main thread,
undoing the compositor benefit of everything above), sticky stacking cards,
pinned horizontal scroll, magnetic buttons (fights Fitts's law), bento grids,
`d: path()` morphing (no Safari support through v27), and replacing
`Reveal.tsx` with `view()` — `view()` reverses and replays on scroll-up, which
is exactly the behaviour `is-settled` was built to prevent.

---

---

## As built - phases 0 to 7 (complete)

Verified by the Playwright harness on every pass: `verify` (19), `motion` (21),
`tabs` (11), `a11y` (3), `hover` (10), `heroexit` (16), `briefing` (21),
`outcomes` (22), `scrub` (26), `shift`, plus per-element contrast at 1440 and
390 and an overflow sweep at 390/768/1440. Production build clean.

`motion.mjs` lost four assertions to obsolescence rather than to regression:
its count-up block (Stats uses `DigitRoll` now, and `outcomes.mjs` covers it
properly) and its "rail drawn to full width" check (the rail is scrubbed, so a
partial width at an arbitrary scroll position is correct).

### Deviations from the plan above, and why

**1. The hero exit runs on `--hero-clear`, not `animation-timeline: view()`.**
`HeroAmbience` already computes hero scroll progress every frame and already
writes it to a custom property. A second scroll system would have bought a
`@supports` block and two engines where the effect silently does nothing. The
variable is now registered with `@property` as a `<number>`, so it has a typed
initial value of 0 for SSR, no-JS and reduced motion without a `var()` fallback
at each use site.

**2. The exit defocus is on the photograph, not the content.** The plan put a
2px blur on the whole hero. A `filter` on a subtree containing text drops that
text out of subpixel antialiasing *permanently* - the headline would render
visibly thinner at rest, before any scroll. The frame carries the blur; the
words only fade and lift. Better art direction as well: the image defocuses,
the message leaves.

**3. The briefing resolves confidence SCORES, not subject lines.** The plan's
decrypt-on-subject fails its own width test - restricting the charset stops
blank glyphs but does nothing about proportional metrics, and the subject sits
in a `truncate` flex row where a width change shoves the preview text sideways
every frame. Scores are already `.ui-num` (tabular-nums), so they are exactly
width-stable, and a confidence figure settling is a *better* depiction of the
thing anyway: the subject line was never unknown, the classification was.
Reuses `CountUp` (one new `decimals` prop) rather than adding a component.

**4. The border beam is a masked conic gradient, not `offset-path: rect()`.**
rect() gives constant linear velocity, which is the better motion; a conic
sweeps at constant angular velocity, so the light hurries along a wide card's
short edges. At a 16s lap that variation reads as organic, and the conic form
works everywhere `@property` ships - a much larger set. Span is 8% of the
sweep: anything wider smears across the whole top edge at 4:1.

**5. The sheen moved out of Phase 2 into Phase 7.** By the plan's own rule it
may not sit over the photograph (no computable contrast floor), and every word
of the hero is over the photograph. It belongs on Statement, which is flat
moss.

**6. Phase 3's "convergence scrub" was dropped as a duplicate.** Six lines
converging is Phase 5's thesis and Phase 5 is where the six experts actually
are. Doing it twice would spend the idea before its own section arrives.

**7. Phase 6 is not a 400vh sticky track.** Four steps pinned across four
screens is the pattern this very document rejects two sections down, under
pinned horizontal scroll and sticky stacking cards - it spends the reader's
scroll to show ~120 words, and it needs a whole second layout so reduced-motion
users are not handed four blank screens. What the section actually lacked was
not length but *connection to input*: the rail fired once on arrival. It is now
scrubbed against a named `view-timeline` in the space it already occupied, so
it draws as you scroll and retracts as you scroll back. Same idea, one screen,
no parallel layout, and browsers without scroll-driven animation keep the
one-shot.

**8. View Transitions on the tab swap were skipped.** It would replace working,
fully keyboard-tested code with `startViewTransition` + `flushSync` for a
cross-fade indistinguishable from the two-beat `panel-in` already there.

### Two real bugs the scroll work uncovered

**`overflow-hidden` silently freezes view timelines.** `overflow: hidden` makes
an element a *scroll container*, and a view timeline resolves against its
subject's nearest scroll container - so the pipeline rail's timeline was bound
to a section that never scrolls and sat pinned at a constant 20% progress, and
the statement's words never moved at all. Both sections now use `overflow-clip`,
which clips identically without the scroll-container side effect. Worth knowing
before adding any further scroll-driven work to a section on this page: most of
them are `overflow-hidden`.

**An anonymous `view()` on a word is useless.** The subject is then the span
itself, and a span's `entry` range is only as tall as the span - about 20px of
scroll, so all twelve words resolved inside a single flick. The timeline is
named on the sentence instead, giving every word one shared viewport-sized
interval to be staggered across.

Also: `animation-range: entry 70% cover 58%` is legal but the two ends are
measured against different intervals, so the range can invert with no error and
just stop being monotonic. Keep both ends in the same range name.

### The one exemption from the reduced-motion reset

`.scroll-rail-progress` re-declares its scroll timeline with `!important`
inside the reduced-motion block. This is not a preference. Phase 0.2 added
`animation-timeline: auto !important` to the global reset, which would put the
page-progress rail on the document timeline where the 0.01ms duration completes
it instantly - leaving a bar reading FULL wherever you actually are. That is not
less motion, it is wrong information. The rail only moves when the reader moves
it, so it stays; everything else in the reset is untouched.

### Numbers that changed

| | Was | Now |
|---|---|---|
| `SETTLE_MS` | 2800 | 1500 (floor set by the longest chain, measured) |
| stagger step | 85ms | 55ms, via one `--stagger-step` |
| briefing tile base | 1150ms | 380ms |
| scan pass | 0.72s delay + 1.45s | 0.35s + 0.95s |
| flag delays | 1180/1430/1680ms | 700/840/980ms (were landing after the sweep that produced them) |
| card reveal | 900ms | 560ms |
| rail draw | 1.15s | 0.7s |
| headline line-up | 1s | 0.72s |
| `.rise` | 0.85s | 0.62s |
| hero entrance chain | ends 1380ms | ends ~1080ms, headline first |
| hover in / out | 350 / 350ms | 140 / 260ms |
| overshoot easing | `.node-pop` + `.flag-in` | `.node-pop` only |

Full hero build order was also wrong: the badge sits *above* the headline but
entered at 620ms, after the paragraph below it, so the top of the hero read as
a gap that filled in late.

---

---

## Refinement pass - the contrast harness was lying

Reviewing the built page at 390 turned up three layout bugs and then, while
chasing one of them, a much bigger problem: **the contrast harness had three
independent defects, all of which ran optimistic.** It had been reporting
ALL PASS on a page with 46 failing elements.

### The three harness defects

**1. It recognised two foreground colours.** `base = LIME if "156, 252" in
color else BONE` - so every colour that was not lime was measured as if it
were bone. The briefing's `$48,000` is bark on moss, a genuine 2.47:1, and it
was reported as 9.21:1. Fixed by painting the computed colour to a 1x1 canvas
and reading the pixel back, which resolves any colour syntax exactly.

**2. It guessed the background from pixels inside the glyph box.** A 55th-
percentile split assumes ink never covers half a text box. It does on a 72px
display numeral, where the cut landed inside the ink and a legible numeral
measured 1.18:1. Switching to the modal luminance was worse - on a box that
tightly hugs two characters the mode IS the ink, which produced fg == bg and
a ratio of exactly 1.00. Background is now composited analytically from
ancestor `background-color`s, falling back to a left/right pixel ring only
when a gradient or photograph is involved. (Ring sampling above and below put
the neighbouring line of a multi-line heading into the "background".)

**3. It composited alpha in luminance space.** `fg_y = Y(fg) * a + Y(bg) *
(1 - a)`. Alpha compositing happens in sRGB, and the error is not small:
`bone/40` on moss is **2.74:1**, not the 4.28:1 it reported. Since almost
every tertiary tint on this page is a semi-transparent bone, this one defect
was hiding most of the failures by itself.

It also only measured 26 hand-listed selectors. It now discovers every
text-bearing element on the page - 161 at 1440, 142 at 390.

### What was actually broken

| | Was | Now |
|---|---|---|
| `$48,000` at-risk figure | bark on moss, 2.47:1 | `ember`, 4.98:1 |
| every `.eyebrow` on a bone section | bark, 3.73:1 at 12px | `clay`, 5.03:1 |
| Experts inactive tab label | `forest/70`, 3.26:1 | `forest`, 5.70:1 |
| Experts tab numerals | `bark/55`, 1.99:1 | `clay` / `forest` |
| briefing tertiary text | `bone/40-55`, 2.74-3.88:1 | `bone/65`, 4.81:1 |
| pipeline step bodies | `bone/65` on forest, 3.59:1 | `bone/85`, 4.56:1 |
| footer links and legal | `bone/40`, 2.74:1 | `bone/65` |
| nav links over the hero | `bone/70`, 3.86:1 | `bone/85` |
| statement lead at 390 | `paper/80`, 4.13:1 | `paper/90`, 4.77:1 |

Two new tokens, both derived from bark rather than invented:

- **`ember`** = bark 50% + bone. For warm text on a DARK ground. Exists so the
  briefing can carry an alarm colour without spending the single lime accent.
- **`clay`** = bark 70% + moss. For small warm text on a LIGHT ground. The
  brand notes already said bark on bone was "large text only"; every 12px
  eyebrow on the page was set in it anyway.

161 / 142 / 138 elements pass at 1440 / 390 / 768.

### Three layout bugs at 390

**The tab indicator underlined the wrong row.** The pills wrap to two rows at
every width below 768, and the bar was pinned to the bottom of the list -
about 55px below the selected tab, pointing at a different one. It now
carries a `--tab-y` from `offsetTop + offsetHeight`.

**The pipeline lost its pipeline.** Below `lg` both the rail and the nodes
were hidden and the layout fell back to a 2x2 grid, leaving four numbered
blocks with nothing joining them. A pipeline is linear; 2x2 reads as a set of
boxes. It is now one column with a vertical rail, scrubbed against the same
view-timeline as the horizontal one.

**The briefing's metric strip stacked into three full-width rows** on a phone,
which is the one thing no real dashboard does with three numbers. Three
across at every width.

### Measured and left alone

The Experts panel `min-h-[26rem]` looked like 200px of dead space in a
screenshot. Measuring all six panels at four widths showed the natural spread
is still 58px and the reserve is real - the apparent gap was the section's own
bottom padding. No change.

---

---

## Three-section pass - Integrations, Statement, Pipeline

### Integrations - animated SVGs

Was the thinnest section on the page: an eyebrow and one centred row of
icon-plus-wordmark, stating a claim about traffic without showing any. Now a
grid of tiles, each with a mark built for motion rather than a static icon
with a wiggle added.

Five purpose-made marks in `IntegrationMarks.tsx`, deliberately separate from
`icons.tsx` - those are 13-20px static glyphs used all over the page, where
animation would be noise. Three shared primitives, no per-icon special cases:

| | |
|---|---|
| `.mk-draw` | every stroke draws itself in on arrival, staggered |
| `.mk-run` | a short dash chases along a path - a signal moving through it |
| `.mk-step` | discrete movement, `steps(1, end)` |

`pathLength="1"` carries the whole thing: it renormalises each subpath to a
length of 1 whatever its real geometry, so all five marks share one set of
dash numbers regardless of how long their strokes are. No measuring, no
`getTotalLength`, and **no JavaScript in the file at all**.

Each animation says something specific: the Gmail flap re-reads the envelope,
a calendar day steps across the grid in whole days, a record travels the
HubSpot graph node to node, the Slack channels light in sequence, the Stripe
magnetic stripe is read left to right.

Under each tile is a **sync bar** - two signals crossing in opposite
directions, forever. That is the section's actual claim ("reads from, and
writes back to") drawn instead of asserted, and each tile now names its own
direction, because read access and write access are not the same commitment
and a founder deciding whether to connect Stripe cares which one it is.

Still a static grid. A marquee says "we have many"; a grid says "we chose
these", and an infinite loop of sliding logos contradicts a product whose
promise is arrival at rest.

The heading says "Plugs into what you already run", not "Connected in one
click" - the pipeline section says one-click applies to Gmail and Calendar,
so a blanket claim would have been untrue on three of the five.

### Pipeline - depth

Three things move, on deliberately different clocks:

- **the rail** scrubs to the reader's scroll
- **the nodes** scrub too, staggered by `animation-range` so the sequence
  lights in order
- **the signal** is a plain loop, running whether or not anyone is watching

That split is the argument: progress through the page belongs to the reader,
traffic through the pipe belongs to the product, and the second does not stop
overnight. Also added a lead paragraph and a `fact` line per step - the body
says what the stage is for, the fact says what someone evaluating it actually
wants (scope of access, how much is discarded, what runs, when it lands).

### Statement - depth without lightening

The flattest surface on the page: one solid bark rectangle with grain.

`.bark-field` adds a vignette, two dim embers and two slow drifting layers on
coprime periods (31s / 43s). **Everything in it darkens and nothing lightens**
- that is a contrast constraint, not a taste one. The type here is paper at
90%, which measures 4.77:1 on flat bark; a warm pool lifting the centre would
eat straight into a margin of 0.27. So the vignette does the work and the
warmth is a hue shift at constant-or-lower lightness. Plus a scrubbed rule
above the eyebrow.

### Fixed while checking

Five tiles in a two-column grid left a lone half-width orphan at 390 -
directly contradicting the comment I had just written claiming otherwise. The
fifth tile now spans the row below sm.

172 elements pass at 1440, all pass at 390 and 768. Nine suites green,
production build clean.

---

## Licence notes for anyone else on this project

- **Origin UI is AGPL-3.0.** Viral for network-served software. Do not
  copy-paste into a commercial product.
- **ReactBits is MIT + Commons Clause.** Product use fine; cannot be resold as
  a component library.
- **Skiper UI** free tier requires attribution.
- **tailwindcss-motion** is a Tailwind v3 plugin; v4 support unresolved.
- **Theatre.js** — no commits since Aug 2024.
