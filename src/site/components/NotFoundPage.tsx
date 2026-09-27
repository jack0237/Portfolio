import { getDictionary } from "@/i18n/dictionaries";
import { homePath, type Locale } from "@/lib/site";
import { Footer } from "./Footer";
import { Icon } from "./Icon";
import { Navbar } from "./Navbar";

// 404 dans les groupes de routes (fr) et (en) : notFound() d'une page (article inconnu…).
// Même rendu que la 404 globale (global-not-found.tsx), dans la langue du groupe, avec la
// navbar et le footer du site (QA F06). L'onglet de contact est masqué en CSS sur .nf (F12).
export function NotFoundPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.notFound;
  const other = locale === "fr" ? getDictionary("en").notFound : getDictionary("fr").notFound;
  const otherLocale: Locale = locale === "fr" ? "en" : "fr";
  return (
    <>
      <Navbar locale={locale} dict={dict} alternates={{ fr: "/", en: "/en" }} />
      <main id="main" tabIndex={-1} className="container nf">
        <p className="meta">{locale === "fr" ? "Erreur 404" : "Error 404"}</p>
        <h1 className="nf__code">404</h1>
        <p className="h3">{t.title}</p>
        <p style={{ color: "var(--color-text-2)" }}>{t.text}</p>
        <div className="nf__links">
          <a className="btn btn--primary" href={homePath(locale)}>
            {t.back}
            <Icon name="arrow-right" className="icon--slide" />
          </a>
          <a className="btn btn--ghost" href={homePath(otherLocale)} lang={otherLocale} hrefLang={otherLocale}>
            {other.back}
          </a>
        </div>
      </main>
      <Footer locale={locale} dict={dict} alternates={{ fr: "/", en: "/en" }} />
    </>
  );
}
