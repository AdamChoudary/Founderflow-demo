"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const links = [
  { href: "#product", label: "Product" },
  { href: "#experts", label: "Experts" },
  { href: "#how", label: "How it works" },
  { href: "#integrations", label: "Integrations" },
];

/**
 * The nav condenses once you leave the hero.
 *
 * Over the hero it has no surface at all - no fill, no border, no blur - so
 * the photograph runs unbroken to the top of the frame and the bar is just
 * its contents. Past the hero it condenses onto INK, one rung BELOW the moss
 * ground, so the bar reads as recessed into the page rather than as a pill
 * floating on a lighter tray.
 *
 * Both states are declared here as `group-data-[scrolled=true]` utilities
 * rather than in globals.css: utilities outrank the components layer, so a
 * background set in either place has to be set in the winning one or it
 * silently does nothing. `.nav-shell` still owns the transition and the
 * condensed shadow.
 *
 * The scroll handler writes straight to the DOM through a ref rather than
 * through state - a scroll listener that re-renders React on every frame is
 * the classic way to make a page feel heavy.
 */
export default function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let last: boolean | null = null;

    const apply = () => {
      raf = 0;
      const scrolled = window.scrollY > 80;
      // only touch the DOM when the state actually flips
      if (scrolled !== last) {
        last = scrolled;
        el.dataset.scrolled = String(scrolled);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    apply(); // honour a restored scroll position
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /**
   * Which section you are in, marked on the matching link.
   *
   * IntersectionObserver rather than the CSS-only version, for one reason
   * that is not stylistic: `aria-current` has to be set on the element, and
   * CSS cannot set an attribute. A highlight that only exists as a colour
   * tells a sighted user where they are and tells everyone else nothing.
   *
   * rootMargin shrinks the root to a 10% band across the middle of the
   * viewport, so "the current section" means the one under the reader's eye
   * rather than any of the three that happen to be on screen.
   */
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;

    const anchors = new Map(
      links
        .map((l) => [l.href.slice(1), nav.querySelector(`a[href="${l.href}"]`)])
        .filter((e): e is [string, HTMLAnchorElement] => Boolean(e[1])),
    );
    const sections = [...anchors.keys()]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit) return;
        for (const [id, a] of anchors) {
          if (id === hit.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((sec) => io.observe(sec));
    return () => io.disconnect();
  }, []);

  return (
    <header
      ref={ref}
      data-scrolled="false"
      className="group fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-6"
    >
      <nav
        aria-label="Main"
        className="nav-shell relative mx-auto flex max-w-5xl items-center gap-4 rounded-full border border-transparent py-2.5 pl-5 pr-2.5 group-data-[scrolled=true]:border-edge/40 group-data-[scrolled=true]:bg-ink/85 group-data-[scrolled=true]:backdrop-blur-xl sm:gap-8"
      >
        {/* How far down the page you are. Inset from the rounded ends so the
            pill needs no overflow clip. Scrubbed on the root scroll timeline -
            see the note in globals.css about why this one is not switched off
            under reduced motion. */}
        <span
          aria-hidden="true"
          className="scroll-rail-progress pointer-events-none absolute inset-x-6 bottom-0 h-px bg-lime-dim/60"
        />
        <a href="#top" className="shrink-0" aria-label="FounderFlow, home">
          <Image
            src="/logo.png"
            alt="FounderFlow"
            width={140}
            height={36}
            loading="eager"
            className="h-6 w-auto sm:h-7"
          />
        </a>

        <ul className="hidden flex-1 items-center justify-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              {/* Two grounds, two colours. Condensed the links sit on ink and
                  sage is the secondary rung (7.3:1); over the hero they sit on
                  a photograph whose lightest pixels under the bar measure
                  L 0.105, where sage would be 2.8:1 and only paper clears AA
                  (6.0:1). Specificity, not source order, decides: the
                  hover/current rules carry one more compound than the sage
                  rule, so they win inside the condensed state. */}
              <a
                href={l.href}
                className="link-sweep text-fine text-paper transition-colors duration-200 group-data-[scrolled=true]:text-sage group-data-[scrolled=true]:hover:text-paper group-data-[scrolled=true]:aria-[current=true]:text-paper"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* One of exactly three lime placements on the page. moss on lime is
            11.7:1; the press scale is a response to the reader, not motion. */}
        <a
          href="#demo"
          className="ml-auto shrink-0 rounded-full bg-lime px-5 py-2.5 text-fine text-moss transition-transform duration-200 active:scale-[0.98] md:ml-0"
        >
          Join Early Access
        </a>
      </nav>
    </header>
  );
}
