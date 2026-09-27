import type { Dictionary } from "@/i18n/dictionaries";
import { CONTACT_MAILTO } from "@/lib/site";
import { Crosses, Icon } from "@/site/components/Icon";
import { preload } from "react-dom";
import { HeroVisual } from "./HeroVisual";

// Poster du relief = élément LCP mobile (QA F05) : fond CSS, invisible au scanner du navigateur,
// donc préchargé dans <head> avec priorité haute. Un seul fichier par fenêtre (media calqué sur
// HeroVisual.module.css) ; type AVIF : un navigateur sans AVIF ignore le préchargement et
// prend le WebP du CSS.
function preloadPoster() {
  preload("/images/hero/relief-poster-mobile.avif", {
    as: "image",
    type: "image/avif",
    media: "not all and (min-aspect-ratio: 1/1)",
    fetchPriority: "high",
  });
  preload("/images/hero/relief-poster-desktop.avif", {
    as: "image",
    type: "image/avif",
    media: "(min-aspect-ratio: 1/1)",
    fetchPriority: "high",
  });
}

// Scène 01, « Le départ » (DESIGN 7.2). Tout le contenu est visible dans le HTML initial :
// l'animation d'entrée part de cet état (le mot géant est l'élément LCP).
export function HeroScene({ dict }: { dict: Dictionary }) {
  const h = dict.home.hero;
  preloadPoster();
  return (
    <section id="hero" className="hero" data-step={1} aria-labelledby="hero-title">
      <HeroVisual />
      <div className="scene__grid" aria-hidden="true" />
      <div className="container hero__inner">
        <Crosses />
        <p className="meta hero__meta">{dict.home.steps[0]}</p>

        <div className="hero__name">
          <h1 id="hero-title" className="hero__h1">
            <span className="voice hero__first">{h.firstName}</span>{" "}
            <span className="hero__giant" data-giant>
              {h.lastName}
            </span>
          </h1>
        </div>

        <div className="hero__thread" aria-hidden="true">
          <svg viewBox="0 0 1000 12" preserveAspectRatio="none">
            <line className="thread-draw" x1="0" y1="6" x2="1000" y2="6" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="thread-head" />
        </div>

        {/* Titre et alias : bloc à part, jamais superposé au mot géant ni au prénom */}
        <div className="hero__side">
          <p className="h3 hero__title">{h.title}</p>
          <p className="voice-sm hero__signature">{h.signature}</p>
        </div>

        <div className="hero__intro">
          <p className="hero__value">{h.value}</p>
          <div className="hero__ctas">
            <a className="btn btn--primary" href="#projects">
              {h.ctaProjects}
              <Icon name="arrow-right" className="icon--slide" />
            </a>
            <a className="btn btn--ghost" href={CONTACT_MAILTO}>
              {h.ctaContact}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
