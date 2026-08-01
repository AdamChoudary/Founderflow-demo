"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

/**
 * The six experts, as a tab set.
 *
 * Borrowed from ClickUp's feature-pill pattern: a horizontal row of selectable
 * pills with an active indicator, and one detail panel underneath that swaps.
 * It beats the static index it replaced for a specific reason - six items each
 * needing a name, a description and a concrete example is far too much copy to
 * show at once, and a wall of six paragraphs gets skimmed to zero. Showing one
 * at a time means each gets read.
 *
 * Implemented as a real WAI-ARIA tablist: roving tabindex, arrow-key
 * navigation, Home/End. A row of divs with onClick would look identical and be
 * unusable by keyboard.
 */

const experts = [
  {
    n: "01",
    name: "Revenue",
    body: "Spots deals, pricing questions and buying intent before they get buried under everything else.",
    catches: "Your largest account wants the contract closed by Friday.",
  },
  {
    n: "02",
    name: "Relationship",
    body: "Tracks who matters, who is still waiting on you, and who has quietly gone cold.",
    catches: "Priya has been waiting four days on your reply.",
  },
  {
    n: "03",
    name: "Operational",
    body: "Separates the things that need doing from the things that only need reading.",
    catches: "AWS spend is up 22% week over week.",
  },
  {
    n: "04",
    name: "Memory",
    body: "Recalls the thread, the promise and the context sitting behind every message.",
    catches: "You promised the board deck by the 14th.",
  },
  {
    n: "05",
    name: "Battle Plan",
    body: "Turns the morning into an ordered list instead of an open inbox.",
    catches: "Three things today. The rest can wait.",
  },
  {
    n: "06",
    name: "Attention",
    body: "Decides what has earned your focus, and quietly holds back the rest.",
    catches: "41 messages filtered. None of them needed you.",
  },
];

/**
 * Six curves reaching one node.
 *
 * Geometry is generated rather than hand-authored so the six sources stay
 * evenly spread and the control points stay consistent - six literal `d`
 * strings would drift the moment anything was nudged.
 *
 * pathLength="1" renormalises every path to a length of 1 whatever its real
 * geometry, which is why six curves of six different lengths can share one
 * `stroke-dasharray: 1`. No measuring, no getTotalLength, no JS.
 *
 * aria-hidden: this restates the heading directly above it ("Six specialists.
 * One verdict.") and the selected tab is already announced by the tablist.
 * Describing it again would be noise, not information.
 *
 * Inactive curves are edge, the selected curve lime-dim, and the node is a
 * lime-dim ring. The radar ping that used to sit behind it is gone: a
 * permanent pulse beside a one-shot draw only dilutes the draw.
 */
const SRC_Y = [15, 59, 103, 147, 191, 235];
const NODE_X = 286;
const NODE_Y = 125;
const curve = (y: number) => `M 6 ${y} C 112 ${y} 168 ${NODE_Y} ${NODE_X} ${NODE_Y}`;

function Convergence({ active }: { active: number }) {
  return (
    <svg
      viewBox="0 0 300 250"
      className="h-auto w-full max-w-sm"
      aria-hidden="true"
      focusable="false"
    >
      {SRC_Y.map((y, i) => (
        <path
          key={y}
          d={curve(y)}
          pathLength="1"
          className="converge-line"
          data-active={i === active}
          style={{ ["--i" as string]: i }}
        />
      ))}
      <circle
        cx={NODE_X}
        cy={NODE_Y}
        r="6"
        fill="none"
        strokeWidth="2"
        className="stroke-lime-dim"
      />
    </svg>
  );
}

export default function Experts() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listRef = useRef<HTMLDivElement>(null);

  /**
   * One indicator travels between tabs rather than six fading in and out.
   * Position and width are read from the DOM and handed to CSS as custom
   * properties, so the movement itself runs on the compositor.
   *
   * --tab-y is not optional. These pills wrap to two rows at every width
   * below 768px, and an indicator that only tracks x underlines whichever
   * row it happens to be pinned to rather than the tab that is selected.
   * `offsetTop + offsetHeight - 2` puts it on the active tab's own baseline.
   */
  const moveIndicator = useCallback(() => {
    const tab = tabRefs.current[active];
    const list = listRef.current;
    if (!tab || !list) return;
    list.style.setProperty("--tab-x", `${tab.offsetLeft}px`);
    list.style.setProperty("--tab-w", `${tab.offsetWidth}px`);
    list.style.setProperty(
      "--tab-y",
      `${tab.offsetTop + tab.offsetHeight - 2}px`,
    );
  }, [active]);

  // layout effect, not effect: measuring after paint makes the bar visibly
  // jump from 0 on first render
  useLayoutEffect(moveIndicator, [moveIndicator]);

  // the pills wrap at narrow widths, so every resize moves the target
  useEffect(() => {
    const onResize = () => moveIndicator();
    window.addEventListener("resize", onResize);
    // fonts landing late changes tab widths underneath us
    document.fonts?.ready.then(moveIndicator).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, [moveIndicator]);

  const focusTab = (i: number) => {
    const next = (i + experts.length) % experts.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: experts.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    focusTab(map[e.key]);
  };

  const current = experts[active];

  return (
    <section
      id="experts"
      className="bg-moss px-4 py-24 text-paper sm:py-32"
    >
      {/* No glow, no grain, no seam. This section is the base ground; Stats
          above and HowItWorks below are the same hue +0.047 L, so there is
          nothing to bridge and any light placed here would invent a floor. */}
      <div className="mx-auto max-w-6xl">
        <Reveal className="grid items-center gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="max-w-2xl lg:col-span-7">
            <p className="eyebrow text-lime-dim">Mixture of experts</p>
            {/* One tone. The two-tone split ran in five consecutive sections
                and was the main reason the page read as one layout recoloured. */}
            <h2 className="headline mt-5 text-d2 text-balance text-paper">
              Six specialists.
              <br />
              One verdict.
            </h2>
            <p className="mt-6 max-w-lg text-body text-sage">
              Every message is read six ways at once. A conductor agent weighs
              what each expert found and returns a single, ranked answer.
            </p>
          </div>

          {/* Decoration, so it is the first thing to go when space is tight -
              below lg it would sit between the heading and the tabs and push
              the actual content off the first screen. */}
          <div className="hidden justify-self-end lg:col-span-5 lg:block">
            <Convergence active={active} />
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-14">
          <div
            ref={listRef}
            role="tablist"
            aria-label="The six expert models"
            onKeyDown={onKeyDown}
            className="relative flex flex-wrap gap-x-1 gap-y-2 border-b border-edge/40"
          >
            <span className="tab-indicator" aria-hidden="true" />
            {experts.map((e, i) => (
              <button
                key={e.n}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`expert-tab-${e.n}`}
                aria-selected={i === active}
                aria-controls={`expert-panel-${e.n}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative -mb-px cursor-pointer px-4 py-3.5 text-fine transition-colors duration-200 sm:px-5 ${
                  i === active ? "text-paper" : "text-sage hover:text-paper"
                }`}
              >
                {/* numerals stay lime-dim in every state - the selected tab is
                    already carried by the label and the 2px rule under it */}
                <span className="font-accent mr-2.5 text-lime-dim">{e.n}</span>
                {e.name}
              </button>
            ))}
          </div>

          {/* keyed on the active tab so `panel-in` replays on every swap */}
          <div
            key={current.n}
            role="tabpanel"
            id={`expert-panel-${current.n}`}
            aria-labelledby={`expert-tab-${current.n}`}
            tabIndex={0}
            /**
             * min-height below sm only.
             *
             * Panel height is driven by how many lines each description wraps
             * to. Measured across breakpoints, every width from 560px up is
             * stable at a single height, but 390 to 480 vary by ~58px because
             * "Battle Plan" has the shortest description - so tapping that tab
             * on a phone jerked everything below the section up and back down.
             * Re-measured after the callout card came off: the tallest case
             * under sm is 329px, at 480 wide with the Revenue description, so
             * 21rem/336px clears it. (It was 26rem for the taller card.)
             */
            className="grid min-h-[21rem] items-center gap-x-10 gap-y-8 py-12 sm:min-h-0 sm:py-14 lg:grid-cols-12"
          >
            <div className="panel-in lg:col-span-7">
              {/* numeral beside the name, not stacked above it - stacked left
                  a tall thin column and a dead gap under the description */}
              {/* d2s, not d2: this is a child of the section heading and must
                  not be set at the same size as its own parent. */}
              <div className="flex items-baseline gap-5">
                <span className="font-accent text-d2s leading-none text-lime-dim">
                  {current.n}
                </span>
                <h3 className="headline text-d2s text-paper">{current.name}</h3>
              </div>
              <p className="mt-6 max-w-xl text-body text-sage">
                {current.body}
              </p>
            </div>

            {/* Concrete example. The abstract description tells you what the
                expert is for; this tells you what it actually says.

                No card. A tinted panel on the same ground is a false object -
                it reads as a floor lifted 4%, not as a thing resting on one.
                A short rule and a change of size do the same separating work
                with no surface at all. */}
            {/* second beat: the example lands just after the name, so the
                swap reads as two moves rather than one slab */}
            <div
              className="panel-in lg:col-span-5"
              style={{ animationDelay: "90ms" }}
            >
              <div className="h-px w-12 bg-lime-dim" aria-hidden="true" />
              <p className="mt-6 text-d3 text-balance text-paper">
                {current.catches}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
