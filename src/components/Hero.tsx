import Image from "next/image";
import HeroAmbience from "./HeroAmbience";
import { ArrowRight } from "./icons";

/**
 * Full-bleed photograph on the page's own moss ground, cinematic scrim, one
 * clear message.
 *
 * Layer order, back to front:
 *   moss     - the page ground, identical to every section below this one
 *   photo    - the frame, slowly pushing in as you scroll
 *   scrim    - the contract with legibility; nothing pale sits outside it
 *   grain    - film
 *   content
 *
 * The scrim is not decoration. An arbitrary photograph is not guaranteed to
 * be dark where the words land, so the pool behind the copy is what keeps
 * paper text above 4.5:1 regardless of which frame is loaded. Swap the image
 * freely; do not remove the scrim.
 *
 * Four elements, no more: headline, lead, two CTAs. The old base bar
 * (pipeline blurb, scroll cue) and the waitlist pill are gone - the pipeline
 * is the briefing section's subject, the waitlist count belongs beside the
 * form it feeds, and a scroll cue is a page apologising for its own fold.
 *
 * `.atmos` lives here and nowhere else on the page: it is the one section
 * with a real photograph for it to sit on. It is a positioning host for the
 * grain and nothing more - the depth in this frame comes from the plate and
 * the scrim, both of which are measured. Its four painted layers
 * (.atmos-fog / -shafts / -canopy / -wash) are NOT rendered: fog pools, god
 * rays and a canopy silhouette were drawn for the forest plate, and on a
 * render they fight the image while duplicating the scrim's job. If you
 * restore them, re-measure - they were the only thing between this copy and
 * the photograph.
 *
 * Entrances are CSS-only - above-the-fold content must never wait on
 * JavaScript to become visible.
 */

/**
 * The hero plate. Both candidates live in public/ so switching is this one
 * line; see docs/hero-image-brief.md for what a replacement has to satisfy.
 *
 *   /hero-filaments.jpg  rendered, many threads braiding into one  (current)
 *   /hero-dawn.jpg       photographic forest corridor
 *
 * Re-measure per-element contrast after switching. The scrim is tuned to
 * whichever plate is active, not to both.
 */
const HERO_IMAGE = "/hero-filaments.jpg";

export default function Hero() {
  return (
    <section
      id="top"
      className="hero-exit relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-moss px-4 py-28 sm:py-32"
    >
      <div className="hero-photo" aria-hidden="true">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority={false}
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          quality={90}
        />
      </div>

      <div className="hero-scrim" aria-hidden="true" />

      <HeroAmbience />

      <div className="atmos" aria-hidden="true">
        <div className="grain grain-fade-bottom" />
      </div>

      {/* flex-1 + centred, with matched top and bottom padding: with the base
          bar gone the message owns the true optical centre of the frame. */}
      <div className="hero-content relative flex flex-1 items-center justify-center">
        <div className="mx-auto w-full max-w-5xl text-center">
          {/* Each line rises out of its own clip. The second lands a beat
              later, so the sentence resolves the way a thought does. One
              colour across both: the tonal step was hierarchy invented
              inside a single sentence. */}
          <h1 className="headline text-d1 text-paper">
            <span className="line">
              <span>Your AI Executive</span>
            </span>
            <span className="line">
              <span style={{ animationDelay: "110ms" }}>Chief of Staff</span>
            </span>
          </h1>

          <p
            className="rise mx-auto mt-7 max-w-xl text-lead text-pretty text-paper"
            style={{ animationDelay: "180ms" }}
          >
            Watches your business. Identifies what matters. Protects your
            revenue. Tells you exactly what to do next.
          </p>

          {/* A matched pair: same pill geometry, different weight. The fill
              carries the primary, the hairline carries the secondary. The
              secondary is never a lime outline - lime is the signal, and a
              signal that marks two things at once marks neither. */}
          <div
            className="rise mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "260ms" }}
          >
            <a
              href="#demo"
              className="inline-flex w-full items-center justify-center rounded-full bg-lime px-8 py-4 text-moss sm:w-auto"
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
        </div>
      </div>
    </section>
  );
}
