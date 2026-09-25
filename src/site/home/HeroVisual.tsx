"use client";

import { useEffect, useRef } from "react";
import { MOTION_EVENT, computeTier } from "@/site/motion/preference";
import styles from "./HeroVisual.module.css";

// Visuel du hero, candidat A « Relief topographique » (choix utilisateur du 2026-09-25,
// docs/ASSETS.md 1 bis). Le poster est rendu côté serveur et s'affiche d'emblée ; la scène
// WebGL (./hero-relief/scene) n'est importée qu'en palier riche (DESIGN 10.4), après le
// premier affichage, puis apparaît en fondu par-dessus. Mobile, appareils modestes,
// prefers-reduced-motion et l'interrupteur du footer : poster seul, aucun code 3D téléchargé.

const OFF_KEY = "jack0237-relief-off"; // la scène a renoncé (trop lente…) : poster pour la visite

type Handle = { dispose: () => void };
type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

function sessionOff() {
  try {
    return sessionStorage.getItem(OFF_KEY) === "1";
  } catch {
    return false;
  }
}

export function HeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const w = window as IdleWindow;
    let scene: Handle | null = null;
    let active = false; // chargement en cours ou scène en place
    let token = 0;
    let idle = 0;
    let timeout = 0;

    const stop = () => {
      token++;
      active = false;
      if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle);
      if (timeout) window.clearTimeout(timeout);
      idle = timeout = 0;
      root.removeAttribute("data-live");
      const s = scene;
      scene = null;
      s?.dispose();
    };

    const start = () => {
      const my = ++token;
      active = true;
      const run = () => {
        idle = timeout = 0;
        if (my !== token) return;
        import("./hero-relief/scene")
          .then(({ createHeroRelief }) => {
            if (my !== token) return;
            scene = createHeroRelief(root, {
              canvasClass: styles.canvas,
              onReady: () => {
                if (my === token) root.setAttribute("data-live", "");
              },
              onFail: () => {
                try {
                  sessionStorage.setItem(OFF_KEY, "1");
                } catch {
                  /* stockage indisponible */
                }
                if (my !== token) return;
                scene = null;
                active = false;
                root.removeAttribute("data-live");
              },
            });
          })
          .catch(() => {
            if (my === token) active = false; // le poster reste
          });
      };
      // Après le premier affichage, quand le fil principal souffle (DESIGN 10.3)
      if (w.requestIdleCallback) idle = w.requestIdleCallback(run, { timeout: 1500 });
      else timeout = window.setTimeout(run, 300);
    };

    const apply = () => {
      const wanted = computeTier() === "rich" && !sessionOff();
      if (!wanted) {
        if (active) stop();
      } else if (!active) {
        start();
      }
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
      mqs.forEach((mq) => mq.removeEventListener("change", apply));
      window.removeEventListener(MOTION_EVENT, apply);
      stop();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div className={styles.poster} />
    </div>
  );
}
