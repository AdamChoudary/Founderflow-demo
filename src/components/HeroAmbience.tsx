"use client";

import { useEffect, useRef } from "react";

/**
 * The two things in the hero that respond to the person using it.
 *
 * 1. Attention bloom - a warm light trailing the pointer. An interface that
 *    quietly attends to where you are looking reads as something thinking
 *    alongside you rather than a surface waiting to be operated.
 *
 * 2. Clearing - as you scroll through the hero, `--hero-clear` runs 0 to 1 and
 *    the thought field fades and drifts apart. The noise clears as you move
 *    down the page: the product's promise performed instead of asserted.
 *
 * Both are merged into one component because both attach to the same element
 * and both must write straight to the DOM. pointermove and scroll fire far
 * faster than React should re-render, so nothing here touches state.
 */
export default function HeroAmbience() {
  const bloomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bloom = bloomRef.current;
    const host = bloom?.parentElement;
    if (!bloom || !host) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    const cleanups: Array<() => void> = [];

    /* ---- clearing on scroll ------------------------------------------- */
    if (!calm.matches) {
      let scrollRaf = 0;
      const applyClear = () => {
        scrollRaf = 0;
        // progress through the hero's own height, clamped
        const p = Math.min(1, Math.max(0, window.scrollY / host.offsetHeight));
        host.style.setProperty("--hero-clear", p.toFixed(3));
      };
      const onScroll = () => {
        if (!scrollRaf) scrollRaf = requestAnimationFrame(applyClear);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      applyClear(); // honour a restored scroll position on load
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
      });
    }

    /* ---- attention bloom ------------------------------------------------ */
    // Pointer warmth is meaningless without a pointer, and unwelcome for
    // anyone who has asked the OS to keep motion down.
    if (fine.matches && !calm.matches) {
      let moveRaf = 0;
      let x = 0;
      let y = 0;

      const draw = () => {
        moveRaf = 0;
        bloom.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      };
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        x = e.clientX - r.left;
        y = e.clientY - r.top;
        if (!moveRaf) moveRaf = requestAnimationFrame(draw);
      };
      const onEnter = () => bloom.classList.add("is-live");
      const onLeave = () => bloom.classList.remove("is-live");

      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerenter", onEnter);
        host.removeEventListener("pointerleave", onLeave);
        if (moveRaf) cancelAnimationFrame(moveRaf);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <div ref={bloomRef} className="bloom" aria-hidden="true" />;
}
