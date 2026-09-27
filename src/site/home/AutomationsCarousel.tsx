"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { Icon } from "@/site/components/Icon";

export const CAROUSEL_EVENT = "jack0237:carousel";

type CarouselApi = { goTo: (index: number) => void };
type WindowWithCarousel = Window & { __jackCarousel?: CarouselApi };

// Cartes d'automatisations. Palier standard : défilement horizontal natif + scroll-snap.
// Palier riche : le moteur épingle la scène et pilote le défilement (window.__jackCarousel).
// Palier réduit : liste verticale (CSS), contrôles masqués.
export function AutomationsCarousel({
  count,
  labels,
  children,
}: {
  count: number;
  labels: { carousel: string; prev: string; next: string };
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const cards = () => Array.from(trackRef.current?.querySelectorAll<HTMLElement>("[data-card]") ?? []);

  const goTo = useCallback((i: number) => {
    const target = Math.max(0, Math.min(count - 1, i));
    const api = (window as WindowWithCarousel).__jackCarousel;
    if (api) {
      api.goTo(target);
      return;
    }
    const track = trackRef.current;
    const card = cards()[target];
    if (!track || !card) return;
    const reduce = document.documentElement.getAttribute("data-motion") === "reduced";
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  }, [count]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const list = cards();
      if (!list.length) return;
      const left = track.scrollLeft;
      let best = 0;
      let dist = Infinity;
      list.forEach((c, i) => {
        const dd = Math.abs(c.offsetLeft - track.offsetLeft - left);
        if (dd < dist) {
          dist = dd;
          best = i;
        }
      });
      setIndex(best);
    };
    const onEngine = (e: Event) => setIndex((e as CustomEvent<number>).detail ?? 0);
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(CAROUSEL_EVENT, onEngine);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener(CAROUSEL_EVENT, onEngine);
    };
  }, []);

  // Tab passe de carte en carte : on amène la carte focalisée à l'écran.
  // Entrée dans la piste depuis l'extérieur (Tab depuis les boutons, Maj+Tab depuis la suite) :
  // le focus va sur la carte affichée, sans rembobiner le carrousel (QA F04).
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
    if (!track || !card) return;
    const list = cards();
    const i = list.indexOf(card);
    if (i < 0) return;
    const from = e.relatedTarget as Node | null;
    if (!from || !track.contains(from)) {
      const current = list[index];
      if (current && current !== card) {
        current.focus({ preventScroll: true });
        // Défilement natif (palier standard) : le navigateur a déjà amené la carte d'entrée,
        // on revient sur la carte affichée.
        if (!(window as WindowWithCarousel).__jackCarousel) goTo(index);
      }
      return;
    }
    if (i !== index) goTo(i);
  };

  // Palier riche : la piste est déplacée en transform ; le navigateur ne doit pas faire défiler
  // la fenêtre de visualisation (overflow hidden) pour montrer une carte focalisée.
  const onViewportScroll = () => {
    const vp = viewportRef.current;
    if (vp && vp.scrollLeft !== 0 && vp.parentElement?.classList.contains("is-pinned")) vp.scrollLeft = 0;
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="auto" role="region" aria-label={labels.carousel}>
      <div className="auto__controls">
        <span className="meta auto__count" aria-hidden="true">
          <b>{pad(index + 1)}</b> / {pad(count)}
        </span>
        {/* aria-disabled et non disabled : le bouton garde le focus en bout de course (QA F04) */}
        <button
          type="button"
          className="auto__btn"
          aria-label={labels.prev}
          aria-disabled={index === 0}
          onClick={() => index > 0 && goTo(index - 1)}
        >
          <Icon name="arrow-left" />
        </button>
        <button
          type="button"
          className="auto__btn"
          aria-label={labels.next}
          aria-disabled={index === count - 1}
          onClick={() => index < count - 1 && goTo(index + 1)}
        >
          <Icon name="arrow-right" />
        </button>
      </div>
      <div className="auto__viewport" ref={viewportRef} onScroll={onViewportScroll}>
        <div className="auto__track" ref={trackRef} onFocus={onFocus}>
          {children}
        </div>
      </div>
      <div className="auto__dots" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={i === index ? "is-active" : undefined} />
        ))}
      </div>
    </div>
  );
}
