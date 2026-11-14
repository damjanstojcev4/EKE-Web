"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const textSelector = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote",
  "figcaption", "li", "dt", "dd", ".figma-text", ".hero-heading-line",
  "footer nav a", "footer .address", "footer .social > strong",
  ".news-meta strong", ".news-meta time", "[data-text-reveal]",
].join(",");
const excluded = "header, form, [aria-live], [role=status], [role=alert], [role=tooltip], .sr-only, [data-text-reveal=off]";

/** Progressive enhancement: keep React's text, links and line wrapping intact. */
export default function TextReveals() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window)) return;
    const seen = new WeakSet<HTMLElement>();
    const pending = new Map<HTMLElement, Animation>();
    let frame = 0;

    const finish = (element: HTMLElement) => {
      pending.get(element)?.cancel();
      pending.delete(element);
      observer.unobserve(element);
      element.removeAttribute("data-reveal-state");
    };
    const observer = new IntersectionObserver((entries) => {
      let stagger = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        const animation = pending.get(element);
        if (!animation) continue;
        animation.effect?.updateTiming({ delay: Math.min(stagger++ * 75, 300) });
        element.dataset.revealState = "playing";
        animation.play();
        observer.unobserve(element);
      }
    }, { rootMargin: "0px 0px -5% 0px", threshold: 0 });

    const scan = () => {
      frame = 0;
      for (const element of pending.keys()) {
        if (!element.isConnected) finish(element);
      }
      if (motion.matches) return;
      const candidates = Array.from(document.querySelectorAll<HTMLElement>(textSelector));
      for (const element of candidates) {
        if (seen.has(element) || element.closest(excluded)) continue;
        // Reveal the individual hero lines, and avoid animating nested text twice.
        if (element.classList.contains("hero-title-animated")) continue;
        const parent = element.parentElement?.closest(textSelector);
        if (parent && seen.has(parent as HTMLElement)) continue;
        if (!element.textContent?.replace(/[\s\u200b]/g, "")) continue;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        if (!rect.width || rect.height < 2 || style.visibility === "hidden" || style.position === "fixed") continue;
        seen.add(element);
        // Restored scroll positions should never hide already-read text.
        if (rect.bottom <= 0) continue;
        const animation = element.animate([
          { opacity: 0, translate: "0 1em", clipPath: "inset(0 -64px 100% -64px)" },
          { opacity: 1, translate: "0 0", clipPath: "inset(-12px -64px -12px -64px)" },
        ], { duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" });
        animation.pause();
        animation.currentTime = 0;
        animation.onfinish = () => finish(element);
        pending.set(element, animation);
        element.dataset.revealState = "waiting";
        observer.observe(element);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(scan);
    };
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, subtree: true });
    const onMotionChange = () => {
      if (motion.matches) {
        for (const element of pending.keys()) finish(element);
      } else schedule();
    };
    // A keyboard user reaching a link must see it immediately.
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      for (const element of pending.keys()) {
        if (element.contains(event.target)) finish(element);
      }
    };
    motion.addEventListener("change", onMotionChange);
    document.addEventListener("focusin", onFocus);
    window.addEventListener("resize", schedule);
    scan();
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      observer.disconnect();
      for (const element of pending.keys()) finish(element);
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("focusin", onFocus);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return null;
}
