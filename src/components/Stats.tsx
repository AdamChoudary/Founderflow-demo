import Reveal from "./Reveal";
import { TargetMark, ListMark, BookmarkMark, ShieldMark } from "./icons";

/**
 * Outcomes: what you get back, before the page explains how it works.
 *
 * ---- The ground ----
 *
 * moss-lift: +0.047 L on the same hue as the hero. That single step is this
 * section's entire separation from its neighbours - no inversion into a light
 * field, no seam, no card, no border box. It used to be a bone ground carrying
 * a paper panel, a breathing backlight and four outlined tiles, which is three
 * surfaces stacked to say one thing.
 *
 * ---- The light is the figures, not a floor ----
 *
 * The numerals ARE the elevation now: paper at --text-numeral straight onto the
 * dark ground (11.19:1). Everything else steps down from them - labels paper at
 * body size, supporting lines sage (5.22:1, replacing the text-bark that was
 * measuring 3.73:1 at 14px and failing this project's own floor).
 *
 * Separation between figures is one edge hairline, not a container. Vertical
 * where the row is a row, horizontal where it stacks; `divide-*` handles both
 * and needs no per-item index maths.
 *
 * The figures are set plainly. They are settled results, not something being
 * computed while you watch - the roll was asserting work that isn't happening.
 */

const metrics = [
  {
    value: "10+",
    label: "hours back every week",
    note: "Time returned by not triaging, chasing or re-reading your own inbox.",
  },
  {
    value: "300+",
    label: "founders on the waitlist",
    note: "Early access is open now, and onboarding in small batches.",
  },
  {
    value: "6",
    label: "expert models per message",
    note: "Running in parallel, then reconciled by a conductor into one answer.",
  },
];

const benefits = [
  { Mark: TargetMark, title: "Knows what deserves your attention" },
  { Mark: ListMark, title: "Tells you what to focus on today" },
  { Mark: BookmarkMark, title: "Remembers every commitment you make" },
  { Mark: ShieldMark, title: "Protects your revenue around the clock" },
];

export default function Stats() {
  return (
    <section className="bg-moss-lift px-4 pb-24 pt-20 sm:pb-32 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="headline max-w-3xl text-d2 text-balance text-paper">
            What you get back.
          </h2>
        </Reveal>

        <Reveal className="mt-14 sm:mt-16">
          <div
            data-metrics-band
            className="stagger grid divide-y divide-edge/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          >
            {metrics.map((m) => (
              <div
                key={m.label}
                className="py-9 first:pt-0 last:pb-0 sm:px-10 sm:py-0 sm:first:pl-0 sm:last:pr-0"
              >
                <p className="font-accent text-numeral leading-none text-paper">
                  {m.value}
                </p>
                <p className="mt-6 max-w-64 text-body text-paper">{m.label}</p>
                <p className="mt-2 max-w-72 text-fine text-sage">{m.note}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Claims, on the same rules as the figures: a ruled row, not tiles. */}
        <Reveal className="mt-16 sm:mt-20">
          <div className="stagger grid divide-y divide-edge/70 [--stagger-base:180ms] lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex items-start gap-4 py-7 first:pt-0 last:pb-0 lg:block lg:px-8 lg:py-0 lg:first:pl-0 lg:last:pr-0"
              >
                <b.Mark className="mt-1 h-6 w-6 shrink-0 text-lime-dim" />
                <h3 className="headline text-lead text-balance text-paper lg:mt-6">
                  {b.title}
                </h3>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
