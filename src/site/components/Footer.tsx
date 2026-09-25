import type { Dictionary } from "@/i18n/dictionaries";
import {
  BUILD_DATE_ISO,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CV_PATH,
  SOCIALS,
  homePath,
  localePath,
  type Locale,
} from "@/lib/site";
import { MotionToggle } from "@/site/motion/MotionToggle";
import { Icon } from "./Icon";
import { LangSwitch, type Alternates } from "./LangSwitch";

export function formatBuildDate(locale: Locale) {
  const d = new Date(BUILD_DATE_ISO);
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(d);
}

export function Footer({
  locale,
  dict,
  alternates,
}: {
  locale: Locale;
  dict: Dictionary;
  alternates: Alternates;
}) {
  const f = dict.footer;
  const year = new Date(BUILD_DATE_ISO).getFullYear();
  const pages = [
    { label: dict.nav.projects, href: localePath(locale, "/projects") },
    { label: dict.nav.resume, href: localePath(locale, "/resume") },
    { label: dict.nav.blog, href: localePath(locale, "/blog") },
    { label: dict.nav.contact, href: `${homePath(locale)}#contact` },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <p className="footer__sig">Jack0237</p>
            <p className="footer__id">
              <strong>Wilfried NGUEGUIM</strong>
              {f.title}
            </p>
          </div>
          <div className="footer__col">
            <h2 className="meta">{f.pages}</h2>
            <ul role="list">
              {pages.map((p) => (
                <li key={p.href}>
                  <a href={p.href}>{p.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h2 className="meta">{f.profiles}</h2>
            <ul role="list">
              {SOCIALS.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener" aria-label={`${s.label} (${dict.newTab})`}>
                    {s.label}
                    <Icon name="arrow-up-right" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h2 className="meta">{f.contact}</h2>
            <ul role="list">
              <li>
                <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                <a href={CV_PATH} download>
                  {f.cv}
                  <Icon name="arrow-down" />
                </a>
              </li>
            </ul>
            <MotionToggle labels={dict.motion} />
          </div>
        </div>

        <div className="footer__bottom meta">
          <span>© {year} Wilfried NGUEGUIM</span>
          <span>
            {f.updated} <time dateTime={BUILD_DATE_ISO.slice(0, 10)}>{formatBuildDate(locale)}</time>
          </span>
          <LangSwitch locale={locale} alternates={alternates} groupLabel={dict.lang.group} />
          <a className="footer__top" href="#top" aria-label={f.topAria}>
            <Icon name="arrow-up" />
            {f.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
