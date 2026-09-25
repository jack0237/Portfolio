import type { Metadata } from "next";
import "./globals.css";
import { dictionaries } from "@/i18n/dictionaries";
import { fontVariables } from "@/site/fonts";
import { Icon } from "@/site/components/Icon";

// 404 globale (plusieurs layouts racines FR / EN) : vraie réponse 404, bilingue,
// à la place de l'ancienne redirection client vers « / » (SEO.md 2.4).
export const metadata: Metadata = {
  title: "404 | Jack0237",
  description: "Page introuvable. Page not found.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  const fr = dictionaries.fr.notFound;
  const en = dictionaries.en.notFound;
  return (
    <html lang="fr" className={fontVariables}>
      <body>
        <main id="main" className="container nf">
          <p className="meta">Erreur 404</p>
          <h1 className="nf__code">404</h1>
          <p className="h3">{fr.title}</p>
          <p style={{ color: "var(--color-text-2)" }}>{fr.text}</p>
          <p className="h3" lang="en">
            {en.title}
          </p>
          <p lang="en" style={{ color: "var(--color-text-2)" }}>
            {en.text}
          </p>
          <div className="nf__links">
            <a className="btn btn--primary" href="/">
              {fr.back}
              <Icon name="arrow-right" className="icon--slide" />
            </a>
            <a className="btn btn--ghost" href="/en" lang="en" hrefLang="en">
              {en.back}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
