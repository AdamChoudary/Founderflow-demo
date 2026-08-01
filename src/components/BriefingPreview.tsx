import Reveal from "./Reveal";

/**
 * The briefing, as the document it is.
 *
 * This used to be a fake dashboard built out of divs: window chrome, traffic
 * lights, a sidebar, an avatar, confidence scores to two decimal places and
 * timestamps to the minute. None of it was real, and precision that isn't real
 * is the fastest way to look untrustworthy. A stylized document is a legitimate
 * marketing device; a screenshot of software that does not exist is not.
 *
 * Ground is `moss` - the same ground as the hero, unchanged, no seam and no
 * ramp. All the light in this section comes from the object: one sheet of
 * `paper` resting on the dark. That is the product metaphor doing real work -
 * the answer is lit on a dark desk at 6am.
 *
 * Contrast, measured, not eyeballed:
 *   paper on moss 13.16   sage on moss 6.14   lime-dim on moss 8.44
 *   ink on paper 15.63    edge on paper 6.13  ink on lime 13.8
 * `edge` is the one token with two jobs: rules on dark, supporting text on
 * paper. Never text on dark (2.15:1).
 *
 * The lime chip is the only lime inside a paper object anywhere on the page.
 */

const items = [
  {
    flag: "Start here",
    // Not Acme, and not Northwind either - Northwind Traders is Microsoft's
    // sample database, which is the same tell in a different costume.
    what: "Thornbury Freight sent the contract back to be signed.",
    todo: "Countersign today. They want it closed by Friday.",
  },
  {
    flag: null,
    what: "Priya Raman is still waiting on the intro you promised.",
    todo: "Two lines from you, or hand it to Dev.",
  },
  {
    flag: null,
    what: "Cloud spend rose again with no release behind it.",
    todo: "Ten minutes in the billing console.",
  },
];

export default function BriefingPreview() {
  return (
    <section id="product" className="bg-moss px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-20">
        <Reveal>
          <p className="eyebrow text-lime-dim">The morning briefing</p>
          {/* .headline may only use letters, digits, "." and "!" - a comma
              renders as a silent blank in TypoGraphica. */}
          <h2 className="headline mt-6 text-balance text-d2 text-paper">
            Everything that mattered. Nothing that did not.
          </h2>
          <p className="mt-7 max-w-sm text-body text-sage">
            Six experts read overnight. This is what they left on your desk.
          </p>
        </Reveal>

        <Reveal className="reveal-card">
          {/* A sheet, not a card: square-ish corners, generous margin, and a
              shadow deep enough to read as an object above the ground rather
              than a panel cut into it. */}
          <article className="mx-auto w-full max-w-md rounded-[3px] bg-paper px-8 py-10 shadow-[0_44px_84px_-32px_rgba(0,0,0,0.85),0_10px_28px_-14px_rgba(0,0,0,0.55)] sm:px-11 sm:py-14">
            <p className="font-accent text-fine uppercase tracking-[0.18em] text-edge">
              Wednesday, 29 July
            </p>

            <ul className="mt-9 divide-y divide-edge/20 border-t border-edge/20">
              {items.map((it) => (
                <li key={it.what} className="py-6">
                  {it.flag && (
                    <span className="mb-3 inline-block rounded-[2px] bg-lime px-2 py-[3px] font-accent text-eyebrow uppercase tracking-[0.16em] text-ink">
                      {it.flag}
                    </span>
                  )}
                  <p className="text-body text-ink">{it.what}</p>
                  <p className="mt-1.5 text-fine text-edge">{it.todo}</p>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
