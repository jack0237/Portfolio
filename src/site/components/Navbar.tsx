"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { SOCIALS, homePath, localePath, type Locale } from "@/lib/site";
import { Icon } from "./Icon";
import { LangSwitch, type Alternates } from "./LangSwitch";

type Props = {
  locale: Locale;
  dict: Dictionary;
  alternates: Alternates;
  /** Indicateur « 01 / 06 » : accueil uniquement. */
  steps?: number;
  current?: "projects" | "resume" | "blog" | "contact";
};

export function Navbar({ locale, dict, alternates, steps, current }: Props) {
  const [solid, setSolid] = useState(false);
  const [step, setStep] = useState(1);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Transparente seulement au repos en haut du hero ; fond dès que l'on défile.
  // (Revue 2026-09-25 : l'ancien seuil « sortie du hero » laissait le mot géant, la phrase
  // de valeur puis les scènes passer sous des liens illisibles.) Lenis défile la fenêtre
  // native : l'événement scroll suffit.
  useEffect(() => {
    if (!document.getElementById("hero")) {
      setSolid(true);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      setSolid(window.scrollY > 16);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Numéro de la scène visible (repère de lecture, aria-hidden).
  useEffect(() => {
    if (!steps) return;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
    if (!scenes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setStep(Number(e.target.getAttribute("data-step")) || 1);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    scenes.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [steps]);

  const home = homePath(locale);
  const links = [
    { key: "projects", label: dict.nav.projects, href: localePath(locale, "/projects") },
    { key: "resume", label: dict.nav.resume, href: localePath(locale, "/resume") },
    { key: "blog", label: dict.nav.blog, href: localePath(locale, "/blog") },
    { key: "contact", label: dict.nav.contact, href: `${home}#contact` },
  ] as const;

  const openMenu = () => dialogRef.current?.showModal();
  const closeMenu = () => dialogRef.current?.close();
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <header className="nav" data-solid={solid ? "true" : "false"}>
      <div className="container nav__inner">
        <a className="nav__logo" href={home} aria-label={dict.nav.logoAria}>
          Jack0237
        </a>
        <nav className="nav__links" aria-label={dict.nav.label}>
          {links.map((l) => (
            <a
              key={l.key}
              className="nav__link"
              href={l.href}
              aria-current={current === l.key ? "page" : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav__right">
          {steps ? (
            <p className="nav__steps meta" aria-hidden="true">
              <b>{pad(step)}</b> / {pad(steps)}
            </p>
          ) : null}
          <LangSwitch locale={locale} alternates={alternates} groupLabel={dict.lang.group} />
          <button
            type="button"
            className="nav__burger"
            aria-label={dict.nav.menuOpen}
            aria-haspopup="dialog"
            onClick={openMenu}
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>

      <dialog ref={dialogRef} className="menu" aria-label={dict.nav.menuDialog}>
        <div className="container">
          <div className="menu__head">
            <a className="nav__logo" href={home} aria-label={dict.nav.logoAria} onClick={closeMenu}>
              Jack0237
            </a>
            <button type="button" className="nav__burger" aria-label={dict.nav.menuClose} onClick={closeMenu}>
              <Icon name="x" />
            </button>
          </div>
          <nav aria-label={dict.nav.label}>
            <ul className="menu__list" role="list">
              {links.map((l) => (
                <li key={l.key}>
                  <a href={l.href} onClick={closeMenu} aria-current={current === l.key ? "page" : undefined}>
                    {l.label}
                    {l.key === "contact" ? <span className="menu__dot" aria-hidden="true" /> : null}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="menu__socials" role="list">
            {SOCIALS.map((s) => (
              <li key={s.key}>
                <a href={s.href} target="_blank" rel="noopener" aria-label={`${s.label} (${dict.newTab})`}>
                  {s.label}
                  <Icon name="arrow-up-right" />
                </a>
              </li>
            ))}
          </ul>
          <div className="menu__lang">
            <LangSwitch locale={locale} alternates={alternates} groupLabel={dict.lang.group} />
          </div>
        </div>
      </dialog>
    </header>
  );
}
