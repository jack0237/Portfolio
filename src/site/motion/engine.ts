// Moteur d'animation : chargé uniquement par import dynamique depuis MotionProvider,
// jamais en mode réduit. Trois familles (DESIGN 6.1) : le fil cyan, les bandes, les révélations.
// On anime « depuis » : l'état final est celui du HTML, rien n'est caché sans ce moteur.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import type { MotionTier } from "./preference";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

const HERO_SEEN_KEY = "jack0237-hero-seen";
// Deux familles de timing (DESIGN 6.5) : retours d'interface en CSS (150 à 300 ms),
// révélations et animations liées au scroll ici (0,8 à 1 s, ease-out marqué, scrub lissé 0,8 à 1).
const EASE_OUT = "expo.out";
const EASE_REVEAL = "power3.out";
const EASE_IN_OUT = "power3.inOut";
const SCRUB = 1;
const SCRUB_LIGHT = 0.8;

type Options = { entrance: boolean };
type WindowWithCarousel = Window & { __jackCarousel?: { goTo: (i: number) => void } };

function heroAlreadySeen() {
  try {
    return sessionStorage.getItem(HERO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}
function markHeroSeen() {
  try {
    sessionStorage.setItem(HERO_SEEN_KEY, "1");
  } catch {
    /* ignoré */
  }
}

export async function startMotion(tier: Exclude<MotionTier, "reduced">, opts: Options): Promise<() => void> {
  const rich = tier === "rich";
  const cleanups: Array<() => void> = [];

  // Lenis : desktop palier riche uniquement (décision Q10).
  let lenis: { scrollTo: (target: number) => void } | null = null;
  if (rich) {
    const { default: Lenis } = await import("lenis");
    const instance = new Lenis({ anchors: { offset: -80 }, autoRaf: false });
    lenis = instance;
    const raf = (time: number) => instance.raf(time * 1000);
    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      lenis = null;
    });
  }

  const ctx = gsap.context(() => {
    // ---------- Hero : entrée (une fois par visite) ----------
    const giant = document.querySelector<HTMLElement>("[data-giant]");
    const hero = document.getElementById("hero");
    if (giant && hero) {
      if (opts.entrance && !heroAlreadySeen()) {
        markHeroSeen();
        const split = SplitText.create(giant, { type: "chars", mask: "chars" });
        const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
        tl.from(split.chars, { yPercent: 100, duration: 1.2, stagger: 0.04 })
          .from([".hero__first", ".hero__title", ".hero__signature"], { opacity: 0, y: 12, duration: 0.7, stagger: 0.12 }, 0.35)
          .from(".hero__thread svg", { scaleX: 0, transformOrigin: "left center", duration: 1.2 }, 0.5)
          .from(".hero__thread .thread-head", { opacity: 0, duration: 0.4 }, 0.9)
          .add(() => split.revert());
      }

      // Sortie : le mot se dissout dans la brume et remonte (parallaxe 0,3).
      giant.classList.add("is-dissolving");
      gsap.set(giant, { "--dissolve": 0 });
      gsap.to(giant, {
        "--dissolve": 1,
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: SCRUB_LIGHT },
      });
    }

    // ---------- Fil cyan : se dessine du hero à la scène finale ----------
    const journey = document.querySelector<HTMLElement>(".journey");
    const line = document.querySelector<HTMLElement>(".thread__line");
    if (journey && line) {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: journey, start: "top 70%", end: "bottom 60%", scrub: SCRUB_LIGHT },
        }
      );
      document.querySelectorAll<HTMLElement>(".journey .scene").forEach((scene) => {
        ScrollTrigger.create({
          trigger: scene,
          start: "top 60%",
          onEnter: () => scene.classList.add("is-passed"),
          onLeaveBack: () => scene.classList.remove("is-passed"),
        });
      });
    }

    // ---------- Titres de scène : révélation ligne par ligne ----------
    document.querySelectorAll<HTMLElement>(".scene__title").forEach((title) => {
      SplitText.create(title, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 100,
            duration: 0.9,
            ease: EASE_OUT,
            stagger: 0.1,
            scrollTrigger: { trigger: title, start: "top 80%", once: true },
          }),
      });
    });

    // ---------- Bandes de transition (palier riche) ----------
    if (rich) {
      document.querySelectorAll<HTMLElement>(".bands").forEach((bands) => {
        const scene = bands.parentElement;
        if (!scene) return;
        gsap.fromTo(
          bands.children,
          { scaleY: 1 },
          {
            scaleY: 0,
            duration: 0.9,
            ease: EASE_IN_OUT,
            stagger: 0.08,
            scrollTrigger: { trigger: scene, start: "top 85%", once: true },
          }
        );
      });
    }

    // ---------- Relanceo : épinglage et arrivée des blocs (palier riche) ----------
    const relanceo = document.querySelector<HTMLElement>(".relanceo");
    if (relanceo) {
      const blocks = relanceo.querySelectorAll<HTMLElement>("[data-reveal]");
      const fits = relanceo.offsetHeight < window.innerHeight - 120;
      if (rich && fits) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: relanceo,
            start: "center center",
            end: "+=120%",
            pin: true,
            scrub: SCRUB,
            anticipatePin: 1,
          },
        });
        tl.from(blocks, { opacity: 0, y: 40, stagger: 0.15, ease: "power2.out" });
      } else {
        gsap.from(blocks, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: EASE_REVEAL,
          stagger: 0.1,
          scrollTrigger: { trigger: relanceo, start: "top 80%", once: true },
        });
      }
    }

    // ---------- Automatisations : carrousel horizontal épinglé (palier riche) ----------
    const auto = document.querySelector<HTMLElement>(".auto");
    const track = auto?.querySelector<HTMLElement>(".auto__track");
    const automations = document.querySelector<HTMLElement>(".automations");
    if (auto && track && automations) {
      const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-card]"));
      if (rich && cards.length > 1) {
        auto.classList.add("is-pinned");
        track.scrollLeft = 0;
        const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
        const last = cards.length - 1;
        let shown = -1;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          // Index calculé sur la progression de l'animation (lissée par le scrub),
          // pas sur celle du scroll : le compteur suit ce que l'on voit.
          // `this` = le tween (la constante n'existe pas encore au premier rendu, appelé à la création).
          onUpdate: function (this: gsap.core.Tween) {
            const i = Math.round(this.progress() * last);
            if (i === shown) return;
            shown = i;
            window.dispatchEvent(new CustomEvent("jack0237:carousel", { detail: i }));
          },
          scrollTrigger: {
            trigger: automations,
            start: "top top+=96",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: SCRUB,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        const st = tween.scrollTrigger;
        (window as WindowWithCarousel).__jackCarousel = {
          goTo: (i: number) => {
            if (!st) return;
            const y = st.start + ((st.end - st.start) * i) / last;
            if (lenis) lenis.scrollTo(y);
            else window.scrollTo({ top: y, behavior: "smooth" });
          },
        };
        cleanups.push(() => {
          delete (window as WindowWithCarousel).__jackCarousel;
          auto.classList.remove("is-pinned");
        });
      }
      // Schémas de flux : le tracé se dessine à l'arrivée de la scène.
      gsap.from(automations.querySelectorAll(".flow__path"), {
        drawSVG: "0%",
        duration: 1.2,
        ease: "power2.inOut",
        stagger: 0.2,
        scrollTrigger: { trigger: automations, start: "top 75%", once: true },
      });
    }

    // ---------- Services : trois branches du fil ----------
    const branches = document.querySelectorAll(".branches__path");
    if (branches.length) {
      // Tracés à trait non proportionnel : révélés par clip-path (DrawSVG ne peut pas les mesurer).
      gsap.from(".branches", {
        clipPath: "inset(0% 100% 0% 0%)",
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: ".services", start: "top 70%", once: true },
      });
    }

    // ---------- Stack : ligne de base ----------
    const baseline = document.querySelector(".stack__baseline");
    if (baseline) {
      gsap.from(baseline, {
        scaleX: 0,
        duration: 1,
        ease: EASE_OUT,
        scrollTrigger: { trigger: baseline, start: "top 90%", once: true },
      });
    }

    // ---------- Révélation partagée des blocs de contenu ([data-reveal] hors Relanceo) ----------
    // L'état caché n'est posé qu'ici (jamais en CSS) : sans JS ou en mode réduit, tout est visible.
    // Transform + opacity seulement : aucune incidence sur la mise en page (pas de CLS).
    const reveals = gsap.utils
      .toArray<HTMLElement>("[data-reveal]")
      .filter((el) => !el.closest(".relanceo"));
    if (reveals.length) {
      gsap.set(reveals, { opacity: 0, y: 30 });
      const show = (batch: Element[]) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: EASE_REVEAL,
          stagger: 0.1,
          overwrite: true,
          clearProps: "opacity,transform",
        });
      ScrollTrigger.batch(reveals, {
        start: "clamp(top 85%)",
        once: true,
        interval: 0.1,
        onEnter: show,
        // Arrivée directe sous un bloc (ancre, rechargement en bas de page) : on révèle aussi.
        onLeave: show,
      });
    }

    // ---------- Arrivée : le fil se termine sur un point fixe ----------
    const arrival = document.querySelector(".final__arrival svg");
    if (arrival) {
      gsap.from(arrival, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".final", start: "top 70%", once: true },
      });
    }
  });

  // Recalcule après le chargement des polices (hauteurs et découpages définitifs).
  document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);

  return () => {
    ctx.revert();
    cleanups.forEach((fn) => fn());
    document.querySelector("[data-giant]")?.classList.remove("is-dissolving");
    document.querySelectorAll(".scene.is-passed").forEach((s) => s.classList.remove("is-passed"));
  };
}
