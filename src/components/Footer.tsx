import Image from "next/image";

const groups = [
  {
    title: "Platform",
    links: [
      { label: "Product", href: "#product" },
      { label: "Experts", href: "#experts" },
      { label: "How it works", href: "#how" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Contact"].map((label) => ({
      label,
      href: "#top",
    })),
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "DPA"].map((label) => ({
      label,
      href: "#top",
    })),
  },
];

/* The closing CTA ramps moss -> ink and has already arrived by the time this
   starts, so the join needs no border, no seam and no gradient of its own.
   Deliberately nothing here draws the top edge. Measured at 1440: the ramp is
   at rgb(12,27,19) twelve px before the footer begins and the worst row-to-row
   step across the join is 1/255.

   Column headings and the licence line are sage/80 (5.11:1 on ink), not edge.
   edge is 2.55:1 on ink - a rule colour, not a text colour, as the palette
   itself says. sage/80 is the nearest legal rung and still sits a step below
   the links (sage, 7.29:1), which is the hierarchy that was wanted. */
export default function Footer() {
  return (
    <footer className="bg-ink px-4 pt-24 pb-16">
      <div className="mx-auto max-w-6xl">
        {/* Three nav groups, so the breakpoint that matters is 3 columns, not 2.
           At sm:grid-cols-2 the logo cell took half a row and Legal wrapped
           alone onto the next one, leaving a dead quarter. */}
        <div className="grid gap-12 sm:grid-cols-3 lg:grid-cols-4">
          <div className="sm:col-span-3 lg:col-span-1">
            {/* paper + lime on dark - the only ground the mark is licensed on */}
            <Image
              src="/logo.png"
              alt="FounderFlow"
              width={140}
              height={36}
              className="h-7 w-auto"
            />
            <p className="mt-5 max-w-xs text-fine text-sage/80">
              AI inbox intelligence for founders.
            </p>
          </div>

          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <p className="eyebrow text-sage/80">{g.title}</p>
              <ul className="mt-5 space-y-3">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="link-sweep text-fine text-sage transition-colors duration-200 hover:text-paper"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-edge/40 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-fine text-sage/80">
            FounderFlow {new Date().getFullYear()}
          </p>
          <p className="text-fine text-sage/80">
            Typefaces: TypoGraphica, Gelline, Combine Mantira Sans. Licensed
            for personal use only.
          </p>
        </div>
      </div>
    </footer>
  );
}
