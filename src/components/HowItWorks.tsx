import Reveal from "./Reveal";

/**
 * The pipeline, as an actual pipeline.
 *
 * Four steps on a rail rather than four cards in a row: the rail carries the
 * eye through the sequence and keeps this section structurally distinct from
 * every other one on the page. Two layouts, and both keep the metaphor -
 * horizontal from lg, vertical below it, because a 2x2 grid reads as a set of
 * boxes and a pipeline is linear.
 *
 * Two things move, and both answer to the reader:
 *
 *   the rail   scrubbed to the scroll, so it draws as they arrive
 *   the nodes  scrubbed too, staggered so the sequence reads in order
 *
 * The packet that used to run the rail on its own 9s loop is gone. A third
 * clock on a rail that already has a scrub and a spark was decoration, and
 * nothing on this page loops any more.
 *
 * The rail exists twice over: an `edge` track that shows the whole run, and
 * the `lime-dim` line drawn along it. Progress needs something to be measured
 * against, otherwise the line is just a line that appears.
 *
 * Each step carries a `fact` as well as a description. The description says
 * what the stage is for; the fact is what a founder evaluating this actually
 * wants to know - scope of access, how much is discarded, what runs, when it
 * lands.
 */

const steps = [
  {
    n: "01",
    title: "Connect",
    body: "Gmail and Calendar link in one click through Google. There is nothing to configure.",
    fact: "Read-only to start",
  },
  {
    n: "02",
    title: "Filter",
    body: "A noise pre-filter clears newsletters, receipts and automated mail before any model runs.",
    fact: "Most of the inbox never reaches a model",
  },
  {
    n: "03",
    title: "Classify",
    body: "Six experts read what is left, in parallel. A conductor agent synthesizes their findings.",
    fact: "Six experts, one conductor",
  },
  {
    n: "04",
    title: "Brief",
    body: "One briefing lands each morning. Revenue signals sync straight through to your CRM.",
    fact: "Waiting before you wake",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      /* overflow-CLIP, not hidden. `overflow: hidden` makes an element a
         scroll container, and a view timeline resolves against its subject's
         nearest scroll container - so the rail's timeline was pinned to this
         section, which never scrolls, and sat frozen at a constant 20%.
         `clip` does the same visual job with no scroll-container side effect.

         moss-lift is the second and final modulation on the page: +0.047 L on
         the identical hue as the sections either side. It registers as a new
         section while scrolling and as the same room while standing still,
         which is why there is no seam to blend - there is nothing to bridge. */
      className="relative isolate overflow-clip bg-moss-lift px-4 py-24 sm:py-32"
    >
      <div className="grain" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="headline text-d2 text-balance text-paper">
            From raw inbox to
            <br />
            one clear morning.
          </h2>
          <p className="mt-6 max-w-lg text-body text-sage">
            It runs while you are asleep. By the time you open your laptop the
            reading is done, and the deciding is the only part left.
          </p>
        </Reveal>

        {/* An actual pipeline rather than a row of cards.

            `rail-track` names a view-timeline on the list, which the rail and
            the nodes inside it scrub against - so the line draws in step with
            the scroll rather than firing once on arrival. See globals.css. */}
        <ol className="rail-track relative mt-16 grid gap-x-8 gap-y-11 sm:mt-20 lg:grid-cols-4 lg:gap-y-14">
          {/* Horizontal rail, wide layout only. The Reveal IS the track: edge
              hairline underneath, lime-dim line drawn over it.

              Both hold to 88% before fading, for the same measured reason as
              the vertical rail below: in a 4-column max-w-6xl grid the nodes
              land at 0.6 / 26 / 52 / 78%, so a default 50% midpoint had the
              track down to ~20% alpha by node 04 and node 04 read as a ring
              floating on its own. The trail-off past the last node survives -
              it just starts after the rail has finished connecting things. */}
          <Reveal className="pointer-events-none absolute left-0 right-0 top-[7px] hidden h-px bg-linear-to-r from-edge via-edge/45 via-88% to-transparent lg:block">
            <span
              aria-hidden="true"
              className="rail-draw block h-px w-full bg-linear-to-r from-lime-dim/75 via-lime-dim/30 via-88% to-transparent"
            />
          </Reveal>

          {/* Vertical rail, stacked layout. The previous version dropped the
              rail AND the nodes below lg and fell back to a 2x2 grid, which
              left four numbered blocks with nothing joining them.

              Same 88% hold as the horizontal rail, for the same reason: the
              default midpoint left the last two nodes visibly unconnected.
              Node 04 sits at 82% on this axis. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-[7px] top-3 w-px bg-linear-to-b from-edge via-edge/60 via-88% to-transparent lg:hidden"
          >
            <span className="rail-draw-y block h-full w-full bg-linear-to-b from-lime-dim/65 via-lime-dim/40 via-88% to-lime-dim/0" />
          </span>

          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <li className="stagger relative pl-10 lg:pl-0">
                <span
                  aria-hidden="true"
                  className="node-pop absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-moss-lift ring-1 ring-lime-dim/50 lg:static lg:mb-7"
                >
                  {/* lights as the rail reaches it, in sequence */}
                  <span
                    className="node-spark h-[5px] w-[5px]"
                    style={{
                      animationRange: `cover ${24 + i * 8}% cover ${32 + i * 8}%`,
                    }}
                  />
                </span>

                <span className="font-accent text-d3 text-lime-dim">{s.n}</span>
                <h3 className="headline mt-3 text-d2s text-paper">{s.title}</h3>
                <p className="mt-3.5 max-w-72 text-fine text-sage">{s.body}</p>

                {/* the concrete detail, set in the accent face rather than as
                    prose so it reads as a spec line and not a third sentence.
                    Sage, not lime-dim: the numeral, the ring and the rail are
                    already carrying the accent in this section. */}
                <p className="eyebrow mt-4 flex items-center gap-2 text-sage">
                  <span
                    aria-hidden="true"
                    className="h-px w-4 shrink-0 bg-edge"
                  />
                  {s.fact}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
