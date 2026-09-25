import type { ReactNode } from "react";

type SceneProps = {
  id: string;
  step: number;
  label: string;
  title: ReactNode;
  titleId: string;
  tone?: "bg" | "panel";
  /** Bandes de transition (desktop, palier riche) : couleur de la scène précédente. */
  bandsFrom?: "bg" | "panel";
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
};

// Scène d'accueil : grille apparente, croix de repère, étiquette mono, un H2 par scène.
export function Scene({ id, step, label, title, titleId, tone = "bg", bandsFrom, aside, className, children }: SceneProps) {
  return (
    <section
      id={id}
      className={`scene scene--${tone}${className ? ` ${className}` : ""}`}
      data-step={step}
      aria-labelledby={titleId}
    >
      <div className="scene__grid" aria-hidden="true" />
      {bandsFrom ? (
        <div className={`bands bands--${bandsFrom}`} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
      ) : null}
      <div className="container scene__inner">
        <span className="scene__dot" aria-hidden="true" />
        <span className="crosses scene__crosses" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <p className="meta scene__label">{label}</p>
        <div className="scene__head">
          <h2 id={titleId} className="display scene__title">
            {title}
          </h2>
          {aside}
        </div>
        {children}
      </div>
    </section>
  );
}
