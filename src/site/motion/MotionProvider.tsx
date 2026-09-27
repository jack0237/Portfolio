"use client";

import { useEffect } from "react";
import { MOTION_EVENT, computeTier, type MotionTier } from "./preference";

type Cleanup = () => void;

// Pose html[data-motion] et charge le moteur GSAP/Lenis par import dynamique,
// après le premier affichage et JAMAIS en mode réduit (DESIGN 6.4 et 10.3).
export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const bootTime = performance.now();
    let cleanup: Cleanup | null = null;
    let token = 0;
    let appliedTier: MotionTier | null = null;

    const apply = () => {
      const tier = computeTier();
      if (tier === appliedTier) return;
      appliedTier = tier;
      root.setAttribute("data-motion", tier);
      const my = ++token;
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
      if (tier === "reduced") return;

      const run = () => {
        if (my !== token) return;
        import("./engine")
          .then(({ startMotion }) => {
            if (my !== token) return;
            // Entrée du hero seulement si le moteur arrive vite et que la page n'a pas défilé.
            const entrance = performance.now() - bootTime < 2500 && window.scrollY < 10;
            return startMotion(tier, { entrance });
          })
          .then((fn) => {
            if (!fn) return;
            if (my !== token) fn();
            else cleanup = fn;
          })
          .catch(() => {
            /* sans moteur, la page reste complète et statique */
          });
      };
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      const schedule = () => {
        if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 1200 });
        else window.setTimeout(run, 200);
      };
      // Après l'événement load (poster du hero compris) : le moteur (~130 Ko) ne concurrence
      // jamais l'affichage de l'élément LCP sur mobile (QA F05).
      if (document.readyState === "complete") schedule();
      else window.addEventListener("load", schedule, { once: true });
    };

    apply();

    const mqs = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(pointer: fine)"),
    ];
    mqs.forEach((mq) => mq.addEventListener("change", apply));
    window.addEventListener(MOTION_EVENT, apply);
    return () => {
      token++;
      mqs.forEach((mq) => mq.removeEventListener("change", apply));
      window.removeEventListener(MOTION_EVENT, apply);
      cleanup?.();
    };
  }, []);

  return null;
}
