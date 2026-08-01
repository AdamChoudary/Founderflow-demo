import Reveal from "./Reveal";
import { ArrowRight } from "./icons";

/**
 * The page's one deliberate ramp, and the only one that runs downward: moss
 * held through the message, then deepening to ink by the bottom edge. The
 * footer is ink, so the ramp has already arrived by the time it starts -
 * there is no seam here and no cut, because there is nothing left to bridge.
 *
 * Centred type survives in exactly this one place. Centring is earned at a
 * close and nowhere else on the page.
 *
 * `.grain` stays: soft-light noise is what keeps ~800px of near-black green
 * gradient from banding on 8-bit displays. It is the only overlay left - the
 * `.atmos` stack and the three `.trace` loops that ran behind the conversion
 * button are gone.
 *
 * `.grain-fade-bottom` is load-bearing, not decoration. Soft-light grain lifts
 * even a flat ground, so this section's last row measured rgb(15,31,22) while
 * the ungrained footer starts at pure ink rgb(12,27,19) - a 0.0023 luminance
 * step against a 0.0000 median drift, which is a hairline across the full page
 * width. Masking the grain out before the edge is what actually makes the ramp
 * arrive with no cut. Remove it and the seam this section exists to avoid
 * comes straight back.
 */
export default function ClosingCTA() {
  return (
    <section
      id="demo"
      className="relative isolate flex min-h-[80svh] items-center bg-linear-to-b from-moss from-45% to-ink px-4 py-32"
    >
      <div className="grain grain-fade-bottom" aria-hidden="true" />

      <Reveal className="relative mx-auto w-full max-w-3xl text-center">
        {/* Display copy: letters, digits, "." and "!" only. Everything else
            is a blank glyph in TypoGraphica. */}
        <h2 className="headline text-d1 text-balance text-paper">
          Get your
          <br />
          <span className="text-paper/70">week back.</span>
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-lead text-balance text-sage">
          You did not build a company to spend your day in email.
        </p>

        {/* Same pair as the hero, same labels, same shapes: lime fill carries
            the primary - the third and last lime on the page - and the paper
            hairline carries the secondary. */}
        <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#demo"
            className="inline-flex w-full items-center justify-center rounded-full bg-lime px-8 py-4 text-moss transition-transform duration-200 active:scale-[0.98] sm:w-auto"
          >
            Join Early Access
          </a>
          <a
            href="#how"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-paper/25 px-8 py-4 text-paper transition-colors duration-200 hover:border-paper/50 sm:w-auto"
          >
            Book a Demo
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
