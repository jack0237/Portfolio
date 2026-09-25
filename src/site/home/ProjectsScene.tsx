import type { Dictionary } from "@/i18n/dictionaries";
import { RELANCEO_URL, localePath, type Locale } from "@/lib/site";
import { Crosses, Icon } from "@/site/components/Icon";
import { AutomationsCarousel } from "./AutomationsCarousel";
import { FlowDiagram } from "./FlowDiagram";
import { Scene } from "./Scene";

// Scène 02, « L'expédition » (DESIGN 7.4). Pas de capture Relanceo tant qu'elle n'est pas
// fournie (ASSETS 5), pas de lien « Étude de cas » tant que la page Projets n'existe pas,
// aucun chiffre de résultat (BRIEF).
export function ProjectsScene({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const p = dict.home.projects;
  const r = p.relanceo;
  const a = p.automations;

  return (
    <Scene
      id="projects"
      step={2}
      label={dict.home.steps[1]}
      title={p.title}
      titleId="projects-title"
      tone="panel"
      bandsFrom="bg"
      className="projects"
    >
      <article className="relanceo" aria-labelledby="relanceo-title">
        <div className="relanceo__text">
          <p className="meta" data-reveal>{r.fig}</p>
          <h3 id="relanceo-title" className="h2 relanceo__name" data-reveal>
            {r.name}
          </h3>
          <p className="relanceo__subtitle" data-reveal>{r.subtitle}</p>

          <div className="relanceo__block" data-reveal>
            <p className="meta">{r.problemLabel}</p>
            <p>{r.problem}</p>
          </div>
          <div className="relanceo__block" data-reveal>
            <p className="meta">{r.doesLabel}</p>
            <ul className="relanceo__list">
              {r.does.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="relanceo__block" data-reveal>
            <p className="meta">{r.stackLabel}</p>
            <ul className="badges" role="list">
              {r.stack.map((s) => (
                <li key={s} className="badge">{s}</li>
              ))}
            </ul>
          </div>
          <div className="relanceo__actions" data-reveal>
            <a className="btn btn--primary" href={RELANCEO_URL} target="_blank" rel="noopener" aria-label={r.ctaAria}>
              {r.cta}
              <Icon name="arrow-up-right" className="icon--slide-up" />
            </a>
          </div>
        </div>

        <figure className="relanceo__aside" data-reveal>
          <Crosses />
          <p className="meta relanceo__url">relanceo.cloud</p>
          <blockquote className="voice relanceo__voice">
            <p>{r.voice}</p>
          </blockquote>
          <figcaption className="voice-sm">Jack0237</figcaption>
        </figure>
      </article>

      <div className="automations">
        <h3 className="meta automations__title" data-reveal>{a.title}</h3>
        <AutomationsCarousel
          count={a.cards.length}
          labels={{ carousel: a.carouselLabel, prev: a.prev, next: a.next }}
        >
          {a.cards.map((c) => (
            <article
              key={c.id}
              className="auto-card"
              data-card
              tabIndex={0}
              aria-labelledby={`auto-${c.id}`}
            >
              <p className="meta">{c.fig}</p>
              <h4 id={`auto-${c.id}`} className="h3 auto-card__name">
                {c.name}
              </h4>
              <FlowDiagram steps={c.steps} label={c.diagramLabel} />
              <p className="auto-card__desc">{c.description}</p>
              {c.note ? <p className="small auto-card__note">{c.note}</p> : null}
              {c.voice ? <p className="voice-sm auto-card__voice">{c.voice}</p> : null}
              <p className="meta auto-card__stack">
                <span className="sr-only">{locale === "fr" ? "Stack : " : "Stack: "}</span>
                {c.stack.join(" · ")}
              </p>
            </article>
          ))}
        </AutomationsCarousel>
        <p className="scene__end" data-reveal>
          <a className="link" href={localePath(locale, "/projects")}>
            {a.all}
            <Icon name="arrow-right" className="icon--slide" />
          </a>
        </p>
      </div>
    </Scene>
  );
}
