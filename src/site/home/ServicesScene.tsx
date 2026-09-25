import type { Dictionary } from "@/i18n/dictionaries";
import { CONTACT_MAILTO } from "@/lib/site";
import { Icon } from "@/site/components/Icon";
import { Scene } from "./Scene";

// Scène 03, « Les itinéraires » (DESIGN 7.6). La page Contact / services n'existe pas encore :
// les cartes ne sont pas cliquables et le lien de fin ouvre l'e-mail. Aucun tarif ni délai.
export function ServicesScene({ dict }: { dict: Dictionary }) {
  const s = dict.home.services;
  return (
    <Scene
      id="services"
      step={3}
      label={dict.home.steps[2]}
      title={s.title}
      titleId="services-title"
      tone="bg"
      bandsFrom="panel"
      className="services"
      aside={<p className="voice scene__voice" data-reveal>{s.voice}</p>}
    >
      <svg className="branches" viewBox="0 0 1200 64" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="branches__path branches__path--0"
          d="M0 4 H200 V64"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="branches__path branches__path--1"
          d="M200 4 H600 V64"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="branches__path branches__path--2"
          d="M600 4 H1000 V64"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <ol className="services__list" role="list">
        {s.cards.map((c, i) => (
          <li key={c.title} className={`service service--${i}`} data-reveal>
            <span className="service__point" aria-hidden="true" />
            <p className="meta service__num">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="service__title">{c.title}</h3>
            <p className="service__text">{c.text}</p>
            <p className="meta service__stack">{c.stack.join(" · ")}</p>
          </li>
        ))}
      </ol>
      <p className="scene__end scene__end--right" data-reveal>
        <a className="link" href={CONTACT_MAILTO}>
          {s.cta}
          <Icon name="arrow-right" className="icon--slide" />
        </a>
      </p>
    </Scene>
  );
}
