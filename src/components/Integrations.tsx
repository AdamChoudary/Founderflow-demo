/* eslint-disable @next/next/no-img-element -- five 24px brand marks straight
   from a CDN; next/image would add a remotePatterns config and an optimiser
   round-trip to serve an SVG that is already 400 bytes. */
import Reveal from "./Reveal";

/**
 * Evidence for the briefing, not a section.
 *
 * It used to be a full ground inversion with a heading, an eyebrow, five
 * tile cards and a category label under each one. All of that argued that
 * "we integrate" is a beat in the story. It is not - it is a footnote to the
 * briefing directly above, and it earns exactly one line of text and the
 * marks themselves.
 *
 * Marks are the real Simple Icons files, tinted to `sage` (#94AC98) by the
 * CDN, so they carry no colour of their own and cannot fight the ground.
 * 6.14:1 on moss, well past the 3:1 floor for non-text graphics.
 *
 * ponytail: no bundled SVGs, no icon package, no build step. If the CDN ever
 * matters (offline demo, air-gapped deploy), drop the five files into
 * `public/marks/` and swap the src - the markup does not change.
 */

/* Slack was removed from Simple Icons at the brand owner's request and its
   slug now 404s. Notion stands in - a real write target for the briefing,
   and a real logo rather than a hand-drawn lookalike. */
const marks = [
  { name: "Gmail", slug: "gmail" },
  { name: "Google Calendar", slug: "googlecalendar" },
  { name: "HubSpot", slug: "hubspot" },
  { name: "Notion", slug: "notion" },
  { name: "Stripe", slug: "stripe" },
];

export default function Integrations() {
  return (
    <section
      id="integrations"
      className="bg-moss px-4 pb-24 text-paper sm:pb-32"
    >
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-body text-paper">
          Reads from and writes back to the tools you already run.
        </p>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16">
          {marks.map(({ name, slug }) => (
            <li key={slug}>
              <img
                src={`https://cdn.simpleicons.org/${slug}/94AC98`}
                alt={name}
                width={28}
                height={28}
                loading="lazy"
                className="h-7 w-7"
              />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
