import type { Dictionary } from "@/i18n/dictionaries";
import { CONTACT_MAILTO, CV_PATH, CV_SIZE_BYTES, SOCIALS, type Locale } from "@/lib/site";
import { Icon } from "@/site/components/Icon";
import { Scene } from "./Scene";

function formatSize(bytes: number, locale: Locale) {
  if (!bytes) return null;
  const kb = Math.max(1, Math.round(bytes / 1024));
  return locale === "fr" ? `${kb} Ko` : `${kb} KB`;
}

// Scène 06, « L'arrivée » (DESIGN 7.12). Contact par e-mail uniquement, aucun téléphone.
// Seul élément braise de l'écran : l'onglet fixe se masque quand cette scène est visible.
export function ContactScene({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const c = dict.home.contact;
  const size = formatSize(CV_SIZE_BYTES, locale);
  return (
    <Scene
      id="contact"
      step={6}
      label={dict.home.steps[5]}
      title={c.title}
      titleId="contact-title"
      tone="bg"
      bandsFrom="panel"
      className="final"
    >
      <p className="final__voice" data-reveal>{c.voice}</p>
      <div className="final__arrival" aria-hidden="true">
        <svg viewBox="0 0 1000 12" preserveAspectRatio="none">
          <line className="thread-draw" x1="0" y1="6" x2="1000" y2="6" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="thread-head thread-head--fixed" />
      </div>
      <div className="final__actions" data-reveal>
        <a className="btn btn--contact" href={CONTACT_MAILTO}>
          {c.cta}
          <Icon name="arrow-right" className="icon--slide" />
        </a>
        <span className="final__cv">
          <a className="btn btn--ghost" href={CV_PATH} download aria-label={c.cvAria}>
            {c.cv}
            <Icon name="arrow-down" className="icon--slide-down" />
          </a>
          {size ? <span className="meta">PDF · {size}</span> : null}
        </span>
      </div>
      <div className="final__foot" data-reveal>
        <ul className="final__socials" role="list">
          {SOCIALS.map((s) => (
            <li key={s.key}>
              <a href={s.href} target="_blank" rel="noopener" aria-label={`${s.label} (${dict.newTab})`}>
                {s.label}
                <Icon name="arrow-up-right" />
              </a>
            </li>
          ))}
        </ul>
        <p className="footer__sig final__sig">{c.signature}</p>
      </div>
    </Scene>
  );
}
