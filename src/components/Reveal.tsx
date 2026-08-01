"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveal. Adds `.is-in` once the element enters the viewport, then
 * disconnects - reveals never replay on scroll-up.
 *
 * ponytail: IntersectionObserver + a CSS transition instead of an animation
 * library. Nothing on this page needs gestures, layout animation or exit
 * transitions, which is the only reason to pay for one.
 */
/**
 * How long to wait before pinning the finished state. This is a FLOOR set by
 * the longest chain inside any revealed block, not a taste value - pinning
 * early would cut a running animation off mid-flight.
 *
 * Longest chains after the motion retune:
 *   briefing tiles  380ms base + 5 x 55ms step + 520ms duration = 1175ms
 *   scan pass       350ms delay + 950ms duration                = 1300ms
 *
 * 1500 clears both with margin for the reveal's own 500ms fade. It used to be
 * 2800 because the tile group alone ran to ~2.3s.
 */
const SETTLE_MS = 1500;

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let settle: ReturnType<typeof setTimeout> | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
          /**
           * Once the choreography has played, pin it.
           *
           * The staggered children animate from opacity 0 with a delay, and a
           * CSS animation restarts whenever the element is re-laid-out or
           * toggled out of display:none - crossing a breakpoint that hides a
           * sidebar is enough. During the restarted delay window the child is
           * back at opacity 0, so already-revealed content can silently
           * disappear. `is-settled` drops the animations entirely and holds
           * the finished state, which is what "reveal once" should mean.
           */
          settle = setTimeout(() => el.classList.add("is-settled"), SETTLE_MS);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (settle) clearTimeout(settle);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
